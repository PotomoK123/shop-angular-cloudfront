export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
};

export const productMock: Product[] = [
  {
    id: '1',
    title: 'Product 1',
    description: 'Product description 1',
    price: 1,
  },
  {
    id: '2',
    title: 'Product 2',
    description: 'Product description 2',
    price: 2,
  },
  {
    id: '3',
    title: 'Product 3',
    description: 'Product description 3',
    price: 3,
  },
];
