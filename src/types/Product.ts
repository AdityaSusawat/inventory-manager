export interface Product {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  created?: string;
  updated?: string;
  name: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  sku?: string;
  category: string;
}
