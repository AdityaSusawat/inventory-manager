import { useEffect, useState } from 'react';
import pb from '../lib/pb';
import type { Product } from '../types/Product';
import '../css/ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // getFullList fetches all records in a single request
        // requestKey: null disables auto-cancellation conflicts
        const records = await pb.collection('products').getFullList<Product>({
          requestKey: null
        });
        setProducts(records);
        setError(null);
      } catch (err: any) {
        // Ignore auto-cancelled errors
        if (err.isAbort) return;
        
        console.error('Error fetching products:', err);
        setError(`Failed to load products: ${err.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
