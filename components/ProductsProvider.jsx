"use client";
// =====================================================================
// 🧺  PRODUCTS PROVIDER — client-side source of truth for the storefront
// ---------------------------------------------------------------------
// Fetches every product from /api/products (MongoDB) once on mount and
// shares them through context. The existing product components read from
// here instead of the old static file, so a product added in the admin
// panel shows up across the site as soon as the data refreshes.
//
// Hooks:
//   useProducts()          → { products, loading, error, refresh }
//   useProduct(id)         → { product, loading }
//   useRelated(id, limit)  → { related, loading }
// =====================================================================
import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

const ProductsContext = createContext({
  products: [],
  loading: true,
  error: null,
  refresh: () => {},
});

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/products", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not load products.");
      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch (err) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ products, loading, error, refresh }),
    [products, loading, error, refresh]
  );

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}

export function useProduct(id) {
  const { products, loading } = useContext(ProductsContext);
  const product = useMemo(
    () => products.find((p) => p.id === id) || null,
    [products, id]
  );
  return { product, loading };
}

export function useRelated(id, limit = 4) {
  const { products, loading } = useContext(ProductsContext);
  const related = useMemo(() => {
    const current = products.find((p) => p.id === id);
    if (!current) return [];
    return products
      .filter((p) => p.id !== id && p.category === current.category)
      .slice(0, limit);
  }, [products, id, limit]);
  return { related, loading };
}
