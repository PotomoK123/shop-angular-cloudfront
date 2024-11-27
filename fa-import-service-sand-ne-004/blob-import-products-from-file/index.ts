import { AzureFunction, Context } from '@azure/functions';
import {
  ServiceBusClient,
  ServiceBusSender,
  ServiceBusMessageBatch,
} from '@azure/service-bus';
import { parse } from 'csv-parse';
import * as stream from 'stream';

const blobTrigger: AzureFunction = async function (
  context: Context,
  myBlob: Buffer,
): Promise<void> {
  context.log('Blob trigger working');

  const bufferStream = new stream.PassThrough();
  bufferStream.end(Buffer.from(myBlob));

  const connectionString = process.env.SERVICEBUS_CONNECTION_STRING;
  const queueName = 'my_servicebus_queue004';

  const serviceBusClient = new ServiceBusClient(connectionString);
  const serviceBusSender: ServiceBusSender =
    serviceBusClient.createSender(queueName);

  bufferStream
    .pipe(parse())
    .on('readable', async function () {
      const record = this.read();
      let serviceBusMessageBatch: ServiceBusMessageBatch =
        await serviceBusSender.createMessageBatch();

      try {
        while (record) {
          if (!serviceBusMessageBatch.tryAddMessage(record)) {
            await serviceBusSender.sendMessages(serviceBusMessageBatch);

            serviceBusMessageBatch =
              await serviceBusSender.createMessageBatch();

            if (!serviceBusMessageBatch.tryAddMessage(record)) {
              throw new Error('Message too big to fit in a batch');
            }
          }
        }

        await serviceBusSender.sendMessages(serviceBusMessageBatch);

        console.log(`Sent a batch of messages to the queue: ${queueName}`);
        await serviceBusSender.close();
      } finally {
        await serviceBusClient.close();
      }
    })
    .on('end', () => {
      context.log('CSV file successfully processed');
    });
};

export default blobTrigger;
