import ProductList from './components/ProductList'
import './css/App.css'
import { useFetchProducts } from './hooks/useFetchProducts';

function App() {

  const { products, loading, error } = useFetchProducts();

  return (
    <div className="app-container">
      <ProductList products={products} loading={loading} error={error} />
    </div>
  )
}

export default App
