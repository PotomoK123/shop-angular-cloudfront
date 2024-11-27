import { AzureFunction, Context } from '@azure/functions';
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
  context.log(
    'HTTP trigger function processed a request.',
    context.bindingData.productId,
  );
  const id = context.bindingData.productId;
  const queryProduct = {
    query: 'SELECT * FROM c WHERE c.id = @productId',
    parameters: [
      {
        name: '@productId',
        value: id,
      },
    ],
  };

  const { resources: productResponse } = await productsContainer.items
    .query(queryProduct)
    .fetchAll();

  context.log('productResponse', productResponse);
  const query = {
    query: 'SELECT * FROM c WHERE c.product_id = @productId',
    parameters: [
      {
        name: '@productId',
        value: productResponse[0].id,
      },
    ],
  };

  const { resources: stockRepsonse } = await stocksContainer.items
    .query<Stock>(query)
    .fetchAll();

  context.log('stockRepsonse', stockRepsonse);

  const response = {
    ...productResponse[0],
    count: stockRepsonse.reduce((acc, item) => acc + item.count, 0),
  };

  context.log('response', response);

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: response,
  };
};

export default httpTrigger;
