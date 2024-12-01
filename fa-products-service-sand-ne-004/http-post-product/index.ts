import { CosmosClient } from '@azure/cosmos';
import { AzureFunction, Context, HttpRequest } from '@azure/functions';
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

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest,
): Promise<void> {
  const product = req.body;

  if (!req.body) {
    context.res = {
      status: 400,
      body: 'No Product data',
    };
  }

  if (
    !product.title ||
    !product.description ||
    !product.price ||
    !product.count
  ) {
    context.res = {
      status: 400,
      body: 'Product data is invalid',
    };
  }

  const preparedProduct = {
    title: product.title,
    description: product.description,
    price: product.price,
  };

  const { resource: productResponce } =
    await productsContainer.items.upsert(preparedProduct);

  const stock = {
    count: product.count,
    product_id: productResponce.id,
  };

  await stocksContainer.items.upsert(stock);

  context.res = {
    body: product,
  };
};

export default httpTrigger;
