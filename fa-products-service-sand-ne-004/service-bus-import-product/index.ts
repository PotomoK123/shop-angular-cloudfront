import { CosmosClient } from '@azure/cosmos';
import { AzureFunction, Context } from '@azure/functions';
import * as dotenv from 'dotenv';

dotenv.config();

const key = process.env.COSMOS_KEY;
const endpoint = process.env.COSMOS_ENDPOINT;

const databaseName = `products-db`;
const productsContainerName = `products`;
const stocksContainerName = `stocks`;
const client = new CosmosClient({ endpoint, key });

const database = client.database(databaseName);
const productsContainer = database.container(productsContainerName);
const stocksContainer = database.container(stocksContainerName);

const serviceBusTrigger: AzureFunction = async function (
  context: Context,
  mySbMsg: string,
): Promise<void> {
  context.log(
    `TypeScript ServiceBus queue trigger function processed product: ${mySbMsg}`,
    typeof mySbMsg,
    // JSON.parse(mySbMsg)
  );

  if (typeof mySbMsg !== 'string') {
    return;
  }

  const [title, description, price, count] = mySbMsg.split(';');

  const preparedProduct = {
    title,
    description,
    price,
  };
  context.log('preparedProduct', preparedProduct);
  const { resource: productResponce } =
    await productsContainer.items.upsert(preparedProduct);

  const stock = {
    count: count,
    product_id: productResponce.id,
  };
  context.log('stock', stock);

  await stocksContainer.items.upsert(stock);

  context.log(`Created item: ${productResponce.id}`);
};

export default serviceBusTrigger;
