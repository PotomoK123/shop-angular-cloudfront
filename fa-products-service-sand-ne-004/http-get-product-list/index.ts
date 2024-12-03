import { AzureFunction, Context } from '@azure/functions';
import { Product } from '../models/product.model';
import { CosmosClient } from '@azure/cosmos';
import { Stock } from '../models/stock.model';
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
): Promise<void> {
  const { resources: productResponse } = await productsContainer.items
    .readAll()
    .fetchAll();
  const { resources: stockResponse } = await stocksContainer.items
    .readAll()
    .fetchAll();

  const mergedResponse = mergeById(
    productResponse as Product[],
    stockResponse as Stock[],
  );

  context.res = {
    body: mergedResponse,
  };
};

function mergeById(products: Product[], stocks: Stock[]) {
  const merged = products.map((item) => {
    const stock = stocks.find(({ product_id }) => product_id === item.id);

    return {
      ...item,
      count: stock.count,
    };
  });

  return merged;
}

export default httpTrigger;
