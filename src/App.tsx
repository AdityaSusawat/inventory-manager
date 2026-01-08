import { useState } from "react";
import ProductList from "./components/ProductList";
import "./css/App.css";
import { useFetchProducts } from "./hooks/useFetchProducts";
import type { CreateProduct, Product } from "./types/Product";
import pb from "./lib/pb";

const AddProduct = ({
  handleAddProduct,
  submitting,
  formError,
}: {
  handleAddProduct: (event: React.FormEvent<HTMLFormElement>) => void;
  submitting: boolean;
  formError: string | null;
}) => {
  return (
    <div>
      <h2>Add Product</h2>
      <form onSubmit={handleAddProduct}>
        <input type="text" name="name" placeholder="Product Name" />
        <input type="number" name="price" placeholder="Price" />
        <input type="number" name="stock" placeholder="Stock" />
        <input type="text" name="category" placeholder="Category" />
        <button type="submit" disabled={submitting}>
          {submitting ? "Adding..." : "Add Product"}
        </button>
      </form>
      {formError && <p className="error">{formError}</p>}
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
      event.preventDefault();
      setSubmitting(true);
      const formData = new FormData(event.currentTarget);
      const name = formData.get("name") as string;
      const price = Number(formData.get("price"));
      const stock = Number(formData.get("stock")) || 0;
      const category = formData.get("category") as string;
      const product: CreateProduct = {
        name,
        price,
        stock,
        lowStockThreshold: 10,
        category,
      };

      //Event can get invalidated/nullified after hitting await, store it (DOM reference) in a variable
      const form = event.currentTarget;

      const newProduct = await pb
        .collection("products")
        .create<Product>(product);

      form.reset();
      setFormError(null);

      setProducts((prev) => [...prev, newProduct]);
    } catch (error) {
      console.error("Error adding product:", error);
      setFormError("Failed to add product");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await pb.collection("products").delete(id);
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Failed to delete product", error);
      alert("Failed to delete product");
    }
  };

  return (
    <div className="app-container">
      <AddProduct
        handleAddProduct={handleAddProduct}
        submitting={submitting}
        formError={formError}
      />
      <ProductList
        products={products}
        loading={loading}
        error={error}
        onDelete={handleDeleteProduct}
      />
    </div>
  );
}

export default App;
