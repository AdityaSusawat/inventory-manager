import { useEffect, useState } from "react";
import type { Product } from "../types/Product";
import pb from "../lib/pb";

export const useFetchProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const records = await pb.collection('products').getFullList<Product>({
                    requestKey: null
                });
                setProducts(records);
                setError(null);
            } catch (err: any) {
                if (err.isAbort) return;
                console.error('Error fetching products:', err);
                setError(`Failed to load products: ${err.message || 'Unknown error'}`);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [])

    return { products, loading, error, setProducts };
}

export default useFetchProducts;