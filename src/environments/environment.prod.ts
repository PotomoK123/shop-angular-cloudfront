import { Config } from './config.interface';

export const environment: Config = {
  production: true,
  apiEndpoints: {
    product: 'https://fa-products-service-ne-004.azurewebsites.net/api',
    order: 'https://.execute-api.eu-west-1.amazonaws.com/dev',
    import: 'https://.execute-api.eu-west-1.amazonaws.com/dev',
    bff: 'https://fa-products-service-ne-004.azurewebsites.net/api',
    cart: 'https://.execute-api.eu-west-1.amazonaws.com/dev',
  },
  apiEndpointsEnabled: {
    product: true,
    order: false,
    import: false,
    bff: true,
    cart: false,
  },
};
