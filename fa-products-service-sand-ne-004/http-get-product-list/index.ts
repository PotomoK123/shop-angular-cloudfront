import { AzureFunction, Context } from '@azure/functions';
import { Product, productMock } from '../models/product.model';

const httpTrigger: AzureFunction = async function (
  context: Context,
): Promise<void> {
  context.log('HTTP trigger function processed a request.');
  const response: Product[] = [...productMock];

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: response,
  };
};

export default httpTrigger;
