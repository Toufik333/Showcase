"use client";

import { useEffect, useState } from "react";
import { Plus, Check, ShoppingBag, Truck, ShieldCheck, Sparkles } from "lucide-react";
import { useCart, Product } from "@/context/CartContext";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedMap, setAddedMap] = useState<Record<number, boolean>>({});
  const { addToCart, setIsCartOpen } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/shop/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    setAddedMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:py-16">
      {/* Hero Section */}
      <div className="mb-12 text-center md:mb-16">
        <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white px-3.5 py-1.5 text-xs font-medium text-[#1d1d1f] shadow-xs">
          <Sparkles size={14} className="text-amber-500" />
          <span>Cash on Delivery Available</span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] sm:text-5xl">
          Modern Hardware & Gear
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#86868b] sm:text-base">
          Curated collection of high-performance tools, displays, and accessories.
          No sign up required — order instantly.
        </p>

        {/* Feature Pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-[#86868b]">
          <div className="flex items-center gap-1.5">
            <Truck size={15} className="text-zinc-700" />
            <span>Fast Local Delivery</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={15} className="text-zinc-700" />
            <span>100% COD Verification</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShoppingBag size={15} className="text-zinc-700" />
            <span>Hassle-free Returns</span>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="animate-pulse rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs"
            >
              <div className="h-48 w-full rounded-xl bg-zinc-100 mb-4" />
              <div className="h-4 w-2/3 rounded bg-zinc-100 mb-2" />
              <div className="h-3 w-full rounded bg-zinc-100 mb-4" />
              <div className="flex justify-between items-center">
                <div className="h-5 w-16 rounded bg-zinc-100" />
                <div className="h-9 w-28 rounded-xl bg-zinc-100" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-12 text-center shadow-xs">
          <p className="text-[#86868b]">No products available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const isJustAdded = addedMap[product.id];
            return (
              <div
                key={product.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs transition-all duration-300 hover:shadow-md hover:border-zinc-300"
              >
                <div>
                  {/* Image */}
                  <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-zinc-100 mb-4">
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-semibold tracking-tight text-[#1d1d1f]">
                    {product.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-[#86868b] leading-relaxed line-clamp-2">
                    {product.description}
                  </p>
                </div>

                {/* Footer: Price & Add Button */}
                <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-4">
                  <div>
                    <span className="text-xs text-[#86868b] block">Price</span>
                    <span className="text-base font-semibold text-[#1d1d1f]">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-medium transition-all active:scale-95 ${
                      isJustAdded
                        ? "bg-emerald-600 text-white"
                        : "bg-zinc-900 text-white hover:bg-zinc-800"
                    }`}
                  >
                    {isJustAdded ? (
                      <>
                        <Check size={14} />
                        <span>Added!</span>
                      </>
                    ) : (
                      <>
                        <Plus size={14} />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
