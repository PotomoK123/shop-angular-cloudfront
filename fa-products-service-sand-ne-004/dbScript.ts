// import { CosmosClient } from '@azure/cosmos';
// import { faker } from '@faker-js/faker';

// const key = process.env.COSMOS_KEY;
// const endpoint = process.env.COSMOS_ENDPOINT;

// const databaseName = `products-db`;
// const productsContainerName = `products`;
// const stockContainerName = `stocks`;

// const client = new CosmosClient({ endpoint, key });

// const database = client.database(databaseName);
// const productsContainer = database.container(productsContainerName);
// const stocksContainer = database.container(stockContainerName);

// async function main() {
//   for (let i = 0; i < 10; i++) {
//     const product = {
//       id: faker.string.uuid(),
//       title: faker.lorem.word(),
//       description: faker.lorem.paragraph(),
//       price: 10,
//     };

//     const stock = {
//       product_id: product.id,
//       count: 10,
//     };

//     await productsContainer.items.upsert(product);
//     await stocksContainer.items.upsert(stock);
//   }

//   console.log('Finished inserting fake data');
// }

// main().catch(console.error);
