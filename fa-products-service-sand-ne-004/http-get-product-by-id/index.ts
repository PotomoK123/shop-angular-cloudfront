import { AzureFunction, Context } from '@azure/functions';
import { Product, productMock } from '../models/product.model';

const httpTrigger: AzureFunction = async function (
  context: Context,
): Promise<void> {
  context.log(
    'HTTP trigger function processed a request.',
    context.bindingData.productId,
  );
  const productId = context.bindingData.productId;
  const response: Product | undefined = productMock.find(
    ({ id }) => id == productId,
  );

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: response,
  };
};

export default httpTrigger;
