"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, ArrowLeft, ShieldCheck, X, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function ShopNavbar() {
  const pathname = usePathname();
  const {
    items,
    totalCount,
    subtotal,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const isAdminRoute = pathname.startsWith("/shop/admin");

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-[#fbfbfd]/80 backdrop-blur-md transition-all">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Link
              href="/shop"
              className="flex items-center gap-2.5 text-base font-semibold tracking-tight text-[#1d1d1f] hover:opacity-80 transition-opacity"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white shadow-sm">
                <ShoppingBag size={16} />
              </div>
              <span>Storefront</span>
            </Link>
            <span className="hidden text-xs text-[#86868b] sm:inline">|</span>
            <Link
              href="/"
              className="hidden items-center gap-1 text-xs font-medium text-[#86868b] hover:text-[#1d1d1f] transition-colors sm:flex"
            >
              <ArrowLeft size={12} />
              Back to Portfolio
            </Link>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center gap-3 sm:gap-4">
            {!isAdminRoute && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 rounded-xl bg-zinc-100 px-3.5 py-2 text-xs font-medium text-[#1d1d1f] transition-colors hover:bg-zinc-200/80 active:scale-[0.98]"
                aria-label="View Cart"
              >
                <ShoppingBag size={16} />
                <span className="hidden sm:inline">Cart</span>
                {totalCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-zinc-900 px-1.5 text-[11px] font-semibold text-white">
                    {totalCount}
                  </span>
                )}
              </button>
            )}

            <Link
              href="/shop/admin/dashboard"
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-medium transition-colors ${
                isAdminRoute
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-[#1d1d1f] hover:bg-zinc-200/80"
              }`}
            >
              <ShieldCheck size={15} />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Cart Slide-Over Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setIsCartOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-zinc-200">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={18} className="text-[#1d1d1f]" />
                  <h2 className="text-base font-semibold text-[#1d1d1f]">
                    Shopping Cart ({totalCount})
                  </h2>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="rounded-lg p-1.5 text-[#86868b] hover:bg-zinc-100 hover:text-[#1d1d1f] transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-[#86868b] mb-3">
                      <ShoppingBag size={24} />
                    </div>
                    <p className="text-sm font-medium text-[#1d1d1f]">Your cart is empty</p>
                    <p className="mt-1 text-xs text-[#86868b]">
                      Explore products and add items to your cart.
                    </p>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 rounded-xl border border-zinc-100 bg-zinc-50/50 p-3"
                    >
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="h-16 w-16 rounded-lg object-cover bg-zinc-200"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-[#1d1d1f] truncate">
                          {item.title}
                        </h4>
                        <p className="text-xs text-[#86868b] mt-0.5">
                          ${item.price.toFixed(2)} each
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center rounded-lg border border-zinc-200 bg-white">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-0.5 text-zinc-600 hover:text-black"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="px-2 text-xs font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-0.5 text-zinc-600 hover:text-black"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="text-xs font-semibold text-[#1d1d1f]">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer */}
              {items.length > 0 && (
                <div className="border-t border-zinc-100 px-6 py-4 bg-zinc-50/50">
                  <div className="flex items-center justify-between mb-3 text-sm">
                    <span className="text-[#86868b]">Subtotal</span>
                    <span className="font-semibold text-[#1d1d1f] text-base">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#86868b] mb-4">
                    Payment Method: <strong className="text-zinc-700">Cash on Delivery (COD)</strong>
                  </p>
                  <Link
                    href="/shop/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-xs font-medium text-white shadow-sm hover:bg-zinc-800 transition-colors"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
