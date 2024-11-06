import { CosmosClient } from '@azure/cosmos';
import { AzureFunction, Context } from '@azure/functions';
import { Product } from '../models/product.model';
import { Stock } from '../models/stock.model';

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
  context.log('HTTP trigger function processed a request.');
  const { resources: productResponse } = await productsContainer.items
    .readAll()
    .fetchAll();
  const { resources: stockResponse } = await stocksContainer.items
    .readAll()
    .fetchAll();
  context.log('Products response: ', productResponse);
  context.log('Stocks response: ', stockResponse);

  const mergedResponse = mergeByIdAndFilterEmpty(
    productResponse as Product[],
    stockResponse as Stock[],
  );

  context.log('Merged response: ', mergedResponse);

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: mergedResponse,
  };
};

function mergeByIdAndFilterEmpty(products: Product[], stocks: Stock[]) {
  const merged = products
    .map((item) => {
      const stock = stocks.find(({ product_id }) => product_id === item.id);

      return {
        ...item,
        count: stock.count,
      };
    })
    .filter((item) => item.count);

  return merged;
}
export default httpTrigger;
