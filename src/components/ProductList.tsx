import '../css/ProductList.css';
import type { Product } from '../types/Product';

const ProductList = ({ products, loading, error }: { products: Product[], loading: boolean, error: string | null }) => {

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
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const isLowStock = product.stock <= product.lowStockThreshold;
              return (
                <tr key={product.id} className={isLowStock ? 'row-low-stock' : ''}>
                  <td className="sku-cell">{product.sku}</td>
                  <td className="name-cell">{product.name}</td>
                  <td className="text-right price-cell">
                    ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="text-right stock-cell">
                    {product.stock}
                  </td>
                  <td>
                    {isLowStock ? (
                      <span className="badge badge-warning">Low Stock</span>
                    ) : (
                      <span className="badge badge-success">In Stock</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
