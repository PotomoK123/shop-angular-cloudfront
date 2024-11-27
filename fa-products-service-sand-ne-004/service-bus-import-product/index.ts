import { CosmosClient } from '@azure/cosmos';
import { AzureFunction, Context } from '@azure/functions';
import * as dotenv from 'dotenv';

dotenv.config();

const key = process.env.COSMOS_KEY;
const endpoint = process.env.COSMOS_ENDPOINT;

const databaseName = `products-db`;
const productsContainerName = `products`;
const client = new CosmosClient({ endpoint, key });

const database = client.database(databaseName);
const productsContainer = database.container(productsContainerName);

const serviceBusTrigger: AzureFunction = async function (
  context: Context,
  mySbMsg: unknown,
): Promise<void> {
  context.log(
    `TypeScript ServiceBus queue trigger function processed product: ${mySbMsg}`,
  );

  const { resource: createdItem } =
    await productsContainer.items.create(mySbMsg);
  context.log(`Created item: ${createdItem.id}`);
};

export default serviceBusTrigger;
