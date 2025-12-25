import { useState } from "react";
import ProductList from "./components/ProductList";
import "./css/App.css";
import { useFetchProducts } from "./hooks/useFetchProducts";
import type { Product } from "./types/Product";
import pb from "./lib/pb";

const AddProduct = ({
  handleAddProduct,
}: {
  handleAddProduct: (event: React.FormEvent<HTMLFormElement>) => void;
}) => {
  return (
    <div>
      <h2>Add Product</h2>
      <form onSubmit={handleAddProduct}>
        <input type="text" name="name" placeholder="Product Name" />
        <input type="number" name="price" placeholder="Price" />
        <input type="number" name="stock" placeholder="Stock" />
        <input type="text" name="category" placeholder="Category" />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

function App() {
  const { products, loading, error, setProducts } = useFetchProducts();

  // Move these states to AddProduct component later
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleAddProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      setSubmitting(true);
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const name = formData.get("name") as string;
      const price = Number(formData.get("price"));
      const stock = Number(formData.get("stock"));
      const category = formData.get("category") as string;
      const product: Product = {
        name,
        price,
        stock,
        lowStockThreshold: 10,
        category,
      };

      const newProduct = await pb
        .collection("products")
        .create<Product>(product);

      setProducts((prev) => [...prev, newProduct]);
    } catch (error) {
      console.error("Error adding product:", error);
      setFormError("Failed to add product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      <AddProduct handleAddProduct={handleAddProduct} />
      <ProductList products={products} loading={loading} error={error} />
    </div>
  );
}

export default App;
