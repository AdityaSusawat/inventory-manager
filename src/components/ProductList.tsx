import { useState } from "react";
import "../css/ProductList.css";
import type { Product } from "../types/Product";

const ProductRow = ({
  product,
  isEditing,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
}: {
  product: Product;
  isEditing: boolean;
  onStartEdit: (id: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: (id: string, updates: Partial<Product>) => void;
  onDelete: (id: string) => void;
}) => {
  const [draft, setDraft] = useState({
    name: product.name,
    price: product.price,
    stock: product.stock,
  });

  const isLowStock = product.stock <= product.lowStockThreshold;

  return (
    <tr className={isLowStock ? "row-low-stock" : ""}>
      <td className="sku-cell">{product.sku}</td>

      <td className="name-cell">
        {isEditing ? (
          <input
            type="text"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
        ) : (
          product.name
        )}
      </td>

      <td className="price-cell">
        {isEditing ? (
          <input
            type="number"
            value={draft.price}
            onChange={(e) =>
              setDraft({ ...draft, price: Number(e.target.value) })
            }
          />
        ) : (
          `$${product.price.toFixed(2)}`
        )}
      </td>

      <td className="stock-cell">
        {isEditing ? (
          <input
            type="number"
            value={draft.stock}
            onChange={(e) =>
              setDraft({ ...draft, stock: Number(e.target.value) })
            }
          />
        ) : (
          product.stock
        )}
      </td>

      <td>
        {isLowStock ? (
          <span className="badge badge-warning">Low Stock</span>
        ) : (
          <span className="badge badge-success">In Stock</span>
        )}
      </td>

      <td>
        {isEditing ? (
          <>
            <button onClick={() => onSaveEdit(product.id, draft)}>Save</button>
            <button onClick={onCancelEdit}>Cancel</button>
          </>
        ) : (
          <>
            <button
              className="btn btn-edit"
              onClick={() => onStartEdit(product.id)}
            >
              Edit
            </button>
            <button
              className="btn btn-delete"
              onClick={() => onDelete(product.id)}
            >
              Delete
            </button>
          </>
        )}
      </td>
    </tr>
  );
};

const ProductList = ({
  products,
  loading,
  error,
  onDelete,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  editingProductId,
}: {
  products: Product[];
  loading: boolean;
  error: string | null;
  onDelete: (id: string) => void;
  onStartEdit: (id: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: (id: string, updates: Partial<Product>) => void;
  editingProductId: string | null;
}) => {
  if (loading) {
    return (
      <div className="status-container">
        <div className="loader"></div>
        <p>Fetching inventory...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="status-container error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="status-container">
        <p>No products found in the inventory.</p>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <header className="list-header">
        <h1>Inventory Dashboard</h1>
        <p className="subtitle">Real-time stock monitoring</p>
      </header>

      <div className="table-responsive">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product Name</th>
              <th className="text-right">Price</th>
              <th className="text-right">Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: Product) => (
              <ProductRow
                key={product.id}
                product={product}
                isEditing={editingProductId === product.id}
                onStartEdit={onStartEdit}
                onCancelEdit={onCancelEdit}
                onSaveEdit={onSaveEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
