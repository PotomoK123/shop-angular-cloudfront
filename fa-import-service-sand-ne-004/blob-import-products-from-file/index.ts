import { AzureFunction, Context } from '@azure/functions';
import { parse } from 'csv-parse';
import * as stream from 'stream';

const blobTrigger: AzureFunction = async function (
  context: Context,
  myBlob: Buffer,
): Promise<void> {
  context.log('Blob trigger working');

  const bufferStream = new stream.PassThrough();
  bufferStream.end(Buffer.from(myBlob));

  bufferStream
    .pipe(parse())
    .on('readable', function () {
      const record = this.read();

      while (record) {
        context.log(record);
      }
    })
    .on('end', () => {
      context.log('CSV file successfully processed');
    });
};

export default blobTrigger;
