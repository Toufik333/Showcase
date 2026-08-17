"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  ShoppingBag,
  CheckCircle2,
  Truck,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  MapPin,
  Phone,
  User,
  Mail,
} from "lucide-react";

export default function CheckoutPage() {
  const { items, subtotal, totalCount, clearCart } = useCart();

  // Form states
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<{
    orderId: number;
    totalAmount: number;
    customerName: string;
    phone: string;
    location: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!customerName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }
    if (!location.trim()) {
      setError("Please enter your full address / location.");
      return;
    }
    if (items.length === 0) {
      setError("Your shopping cart is empty.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/shop/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customerName,
          phone,
          location,
          email: email.trim() || null,
          items: items.map((i) => ({
            product_id: i.id,
            quantity: i.quantity,
            price_at_purchase: i.price,
          })),
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to place order.");
      }

      // Save order details for confirmation view
      setOrderSuccess({
        orderId: data.orderId,
        totalAmount: data.total_amount || subtotal,
        customerName: customerName.trim(),
        phone: phone.trim(),
        location: location.trim(),
      });

      // Clear state
      clearCart();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // If order was successfully placed
  if (orderSuccess) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12 md:py-20 animate-fade-in-up">
        <div className="rounded-3xl border border-zinc-200/80 bg-white p-8 md:p-10 shadow-sm text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 mb-6">
            <CheckCircle2 size={36} />
          </div>

          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
            Order Placed Successfully
          </span>
          <h1 className="mt-2 text-2xl md:text-3xl font-semibold text-[#1d1d1f]">
            Thank You for Your Order!
          </h1>
          <p className="mt-2 text-sm text-[#86868b]">
            Your order <strong className="text-[#1d1d1f]">#{orderSuccess.orderId}</strong> has been received and is set to <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">Pending</span> status.
          </p>

          {/* Order Summary Box */}
          <div className="mt-8 rounded-2xl border border-zinc-100 bg-zinc-50/60 p-6 text-left space-y-3">
            <div className="flex justify-between items-center text-xs pb-3 border-b border-zinc-200/60">
              <span className="text-[#86868b]">Order ID</span>
              <span className="font-semibold text-[#1d1d1f]">#{orderSuccess.orderId}</span>
            </div>
            <div className="flex justify-between items-center text-xs pb-3 border-b border-zinc-200/60">
              <span className="text-[#86868b]">Payment Method</span>
              <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                Cash on Delivery (COD)
              </span>
            </div>
            <div className="flex justify-between items-center text-xs pb-3 border-b border-zinc-200/60">
              <span className="text-[#86868b]">Customer Name</span>
              <span className="font-medium text-[#1d1d1f]">{orderSuccess.customerName}</span>
            </div>
            <div className="flex justify-between items-center text-xs pb-3 border-b border-zinc-200/60">
              <span className="text-[#86868b]">Contact Phone</span>
              <span className="font-medium text-[#1d1d1f]">{orderSuccess.phone}</span>
            </div>
            <div className="flex justify-between items-center text-xs pb-3 border-b border-zinc-200/60">
              <span className="text-[#86868b]">Delivery Location</span>
              <span className="font-medium text-[#1d1d1f] text-right max-w-xs">{orderSuccess.location}</span>
            </div>
            <div className="flex justify-between items-center text-sm pt-1">
              <span className="font-medium text-[#86868b]">Total Amount Due on Delivery</span>
              <span className="font-semibold text-[#1d1d1f] text-base">
                ${orderSuccess.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-xs font-medium text-white shadow-xs hover:bg-zinc-800 transition-colors"
            >
              <ShoppingBag size={15} />
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-100 px-6 py-3 text-xs font-medium text-[#1d1d1f] hover:bg-zinc-200/80 transition-colors"
            >
              Return to Portfolio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Cart Empty redirect option
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-6 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-[#86868b] mb-4">
          <ShoppingBag size={32} />
        </div>
        <h1 className="text-xl font-semibold text-[#1d1d1f]">Your Cart is Empty</h1>
        <p className="mt-2 text-xs text-[#86868b]">
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-xs font-medium text-white shadow-xs hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft size={14} />
          Browse Store Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 md:py-16">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#86868b] hover:text-[#1d1d1f] transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Store
        </Link>
      </div>

      <h1 className="text-2xl font-semibold tracking-tight text-[#1d1d1f] sm:text-3xl mb-8">
        Checkout & Shipping
      </h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 space-y-6">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50/80 p-4 text-xs font-medium text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Delivery Info Box */}
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-semibold text-[#1d1d1f] flex items-center gap-2">
                <User size={16} className="text-zinc-600" />
                Customer & Shipping Details
              </h2>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#86868b]">
                    <User size={15} />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-9 pr-3 text-xs text-[#1d1d1f] placeholder:text-[#86868b] focus:border-zinc-900 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#86868b]">
                    <Phone size={15} />
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-9 pr-3 text-xs text-[#1d1d1f] placeholder:text-[#86868b] focus:border-zinc-900 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Full Address / Location */}
              <div>
                <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">
                  Full Address / Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 pt-2.5 text-[#86868b]">
                    <MapPin size={15} />
                  </div>
                  <textarea
                    required
                    rows={3}
                    placeholder="Street address, Apartment/Suite, City, State/Region"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-9 pr-3 text-xs text-[#1d1d1f] placeholder:text-[#86868b] focus:border-zinc-900 focus:outline-none transition-all resize-none"
                  />
                </div>
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">
                  Email Address <span className="text-xs text-[#86868b] font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#86868b]">
                    <Mail size={15} />
                  </div>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-9 pr-3 text-xs text-[#1d1d1f] placeholder:text-[#86868b] focus:border-zinc-900 focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Option */}
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs space-y-3">
              <h2 className="text-sm font-semibold text-[#1d1d1f]">Payment Option</h2>

              <div className="flex items-center justify-between rounded-xl border-2 border-zinc-900 bg-zinc-50/80 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 text-white">
                    <Truck size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#1d1d1f]">Cash on Delivery (COD)</h4>
                    <p className="text-[11px] text-[#86868b]">Pay with cash when your package arrives.</p>
                  </div>
                </div>
                <span className="rounded-md bg-zinc-900 px-2.5 py-1 text-[10px] font-semibold text-white uppercase tracking-wider">
                  Selected
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-3.5 text-xs font-medium text-white shadow-sm hover:bg-zinc-800 active:scale-[0.99] transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Processing Order...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>Place Order (Cash on Delivery)</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-semibold text-[#1d1d1f] border-b border-zinc-100 pb-3">
              Order Summary ({totalCount} items)
            </h2>

            {/* Items list */}
            <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="h-12 w-12 rounded-lg object-cover bg-zinc-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-medium text-[#1d1d1f] truncate">
                      {item.title}
                    </h4>
                    <span className="text-[11px] text-[#86868b]">
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-[#1d1d1f]">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="border-t border-zinc-100 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-[#86868b]">
                <span>Items Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#86868b]">
                <span>Shipping Fee</span>
                <span className="text-emerald-600 font-medium">FREE</span>
              </div>
              <div className="flex justify-between text-[#86868b]">
                <span>Payment Method</span>
                <span className="text-zinc-700">Cash on Delivery</span>
              </div>

              <div className="border-t border-zinc-100 pt-3 flex justify-between items-center text-sm font-semibold text-[#1d1d1f]">
                <span>Total Due</span>
                <span className="text-base">${subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
