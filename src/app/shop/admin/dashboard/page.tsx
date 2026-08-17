"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  LogOut,
  Key,
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle2,
  Search,
  RefreshCw,
  Loader2,
  ChevronDown,
  X,
  Plus,
  Edit2,
  Trash2,
  Package,
  Image as ImageIcon,
  DollarSign,
  FileText,
} from "lucide-react";

interface OrderItem {
  id: number;
  product_id: number;
  product_title: string;
  quantity: number;
  price_at_purchase: number;
}

interface Order {
  id: number;
  customer_name: string;
  phone: string;
  location: string;
  email: string | null;
  total_amount: number;
  payment_method: string;
  status: "pending" | "shipped" | "done" | "cancelled";
  created_at: string;
  items: OrderItem[];
}

interface Product {
  id: number;
  title: string;
  price: number;
  image_url: string;
  description: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();

  // Tab State: 'orders' | 'products'
  const [activeTab, setActiveTab] = useState<"orders" | "products">("orders");

  const [adminId, setAdminId] = useState<string>("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Search & Filter for Orders
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Search for Products
  const [productSearchQuery, setProductSearchQuery] = useState("");

  // Change Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);
  const [passLoading, setPassLoading] = useState(false);

  // Add / Edit Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    title: "",
    price: "",
    image_url: "",
    description: "",
  });
  const [prodError, setProdError] = useState<string | null>(null);
  const [prodLoading, setProdLoading] = useState(false);

  // Delete Product Confirmation State
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/shop/admin/orders");
      if (res.status === 401) {
        router.push("/shop/admin/login");
        return;
      }
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
        setAdminId(data.adminId || "Admin");
      }
    } catch (err) {
      console.error("Failed to load admin orders", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/shop/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error("Failed to load products", err);
    }
  };

  const handleStatusChange = async (
    orderId: number,
    newStatus: "pending" | "shipped" | "done" | "cancelled"
  ) => {
    try {
      setUpdatingId(orderId);
      const res = await fetch(`/api/shop/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      } else {
        alert(data.error || "Failed to update status.");
      }
    } catch (err) {
      console.error("Status update error:", err);
      alert("Error updating order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/shop/admin/logout", { method: "POST" });
      router.push("/shop/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(null);

    if (newPassword !== confirmPassword) {
      setPassError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setPassError("New password must be at least 6 characters.");
      return;
    }

    try {
      setPassLoading(true);
      const res = await fetch("/api/shop/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to update password.");
      }

      setPassSuccess("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPassSuccess(null);
      }, 1800);
    } catch (err: any) {
      setPassError(err.message || "An error occurred.");
    } finally {
      setPassLoading(false);
    }
  };

  // Product Add / Edit Modal handlers
  const openAddProductModal = () => {
    setEditingProduct(null);
    setProductForm({ title: "", price: "", image_url: "", description: "" });
    setProdError(null);
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      title: product.title,
      price: String(product.price),
      image_url: product.image_url,
      description: product.description || "",
    });
    setProdError(null);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setProdError(null);

    if (!productForm.title.trim()) {
      setProdError("Product title is required.");
      return;
    }
    if (!productForm.price || isNaN(Number(productForm.price)) || Number(productForm.price) < 0) {
      setProdError("Please enter a valid positive price.");
      return;
    }
    if (!productForm.image_url.trim()) {
      setProdError("Image URL is required.");
      return;
    }

    try {
      setProdLoading(true);
      const isEdit = !!editingProduct;
      const url = isEdit
        ? `/api/shop/admin/products/${editingProduct.id}`
        : `/api/shop/admin/products`;

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: productForm.title,
          price: Number(productForm.price),
          image_url: productForm.image_url,
          description: productForm.description,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to save product.");
      }

      await fetchProducts();
      setIsProductModalOpen(false);
    } catch (err: any) {
      setProdError(err.message || "An error occurred saving product.");
    } finally {
      setProdLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      setDeletingProductId(productId);
      const res = await fetch(`/api/shop/admin/products/${productId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
      } else {
        alert(data.error || "Failed to delete product.");
      }
    } catch (err) {
      console.error("Delete product error:", err);
      alert("Error deleting product.");
    } finally {
      setDeletingProductId(null);
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(o.id).includes(searchQuery);

    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered products
  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(productSearchQuery.toLowerCase())
  );

  // Calculate stats
  const totalOrdersCount = orders.length;
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const shippedCount = orders.filter((o) => o.status === "shipped").length;
  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total_amount, 0);

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200/80";
      case "shipped":
        return "bg-blue-50 text-blue-700 border-blue-200/80";
      case "done":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200/80";
      default:
        return "bg-zinc-100 text-zinc-700 border-zinc-200";
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 md:py-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200/80 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-xs">
            <ShieldCheck size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-[#1d1d1f]">
                Admin Dashboard
              </h1>
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-800">
                {adminId || "Admin"}
              </span>
            </div>
            <p className="text-xs text-[#86868b]">
              Manage customer orders & shop catalog products
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-medium text-[#1d1d1f] hover:bg-zinc-50 transition-colors"
          >
            <Key size={14} />
            <span>Change Password</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-xl bg-red-50 px-3.5 py-2 text-xs font-medium text-red-600 hover:bg-red-100/80 transition-colors"
          >
            <LogOut size={14} />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#86868b] mb-2">
            <span className="text-xs font-medium">Total Orders</span>
            <ShoppingBag size={16} />
          </div>
          <span className="text-2xl font-semibold text-[#1d1d1f]">
            {totalOrdersCount}
          </span>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-xs font-medium">Pending Orders</span>
            <Clock size={16} />
          </div>
          <span className="text-2xl font-semibold text-amber-700">
            {pendingCount}
          </span>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-blue-600 mb-2">
            <span className="text-xs font-medium">Store Products</span>
            <Package size={16} />
          </div>
          <span className="text-2xl font-semibold text-blue-700">
            {products.length}
          </span>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-xs font-medium font-mono">Revenue (Active)</span>
            <CheckCircle2 size={16} />
          </div>
          <span className="text-2xl font-semibold text-[#1d1d1f]">
            ${totalRevenue.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Main Section Navigation Tabs */}
      <div className="mt-8 flex border-b border-zinc-200/80">
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-colors ${
            activeTab === "orders"
              ? "border-zinc-900 text-[#1d1d1f]"
              : "border-transparent text-[#86868b] hover:text-[#1d1d1f]"
          }`}
        >
          <ShoppingBag size={16} />
          <span>Customer Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("products")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-colors ${
            activeTab === "products"
              ? "border-zinc-900 text-[#1d1d1f]"
              : "border-transparent text-[#86868b] hover:text-[#1d1d1f]"
          }`}
        >
          <Package size={16} />
          <span>Shop Products Catalog ({products.length})</span>
        </button>
      </div>

      {/* TAB 1: CUSTOMER ORDERS */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          {/* Filters & Refresh Toolbar */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#86868b]">
                  <Search size={15} />
                </div>
                <input
                  type="text"
                  placeholder="Search by customer, phone, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-9 pr-3 text-xs text-[#1d1d1f] placeholder:text-[#86868b] focus:border-zinc-900 focus:outline-none transition-all"
                />
              </div>

              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-zinc-200 bg-white py-2 px-3 pr-8 text-xs font-medium text-[#1d1d1f] focus:border-zinc-900 focus:outline-none transition-all appearance-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="done">Done</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-[#86868b]">
                  <ChevronDown size={14} />
                </div>
              </div>
            </div>

            <button
              onClick={fetchOrders}
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-medium text-[#1d1d1f] hover:bg-zinc-50 transition-colors"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              <span>Refresh Orders</span>
            </button>
          </div>

          {/* Orders Table */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white shadow-xs overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-[#86868b]">
                <Loader2 size={24} className="animate-spin mb-2" />
                <p className="text-xs">Loading orders from database...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="py-16 text-center text-[#86868b]">
                <p className="text-sm font-medium text-[#1d1d1f]">No orders found</p>
                <p className="mt-1 text-xs">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your search query or status filter."
                    : "No customer orders have been placed yet."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#1d1d1f]">
                  <thead className="bg-zinc-50/80 border-b border-zinc-200/80 text-[11px] uppercase tracking-wider text-[#86868b]">
                    <tr>
                      <th className="px-6 py-3.5 font-semibold">Order ID</th>
                      <th className="px-6 py-3.5 font-semibold">Customer Details</th>
                      <th className="px-6 py-3.5 font-semibold">Items Ordered</th>
                      <th className="px-6 py-3.5 font-semibold">Total / Payment</th>
                      <th className="px-6 py-3.5 font-semibold">Date</th>
                      <th className="px-6 py-3.5 font-semibold text-right">Status Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {filteredOrders.map((order) => {
                      const formattedDate = new Date(order.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      });

                      const isUpdating = updatingId === order.id;

                      return (
                        <tr key={order.id} className="hover:bg-zinc-50/50 transition-colors">
                          <td className="px-6 py-4 font-semibold text-zinc-900">
                            #{order.id}
                          </td>
                          <td className="px-6 py-4 max-w-xs">
                            <div className="font-semibold text-[#1d1d1f]">
                              {order.customer_name}
                            </div>
                            <div className="text-[#86868b] mt-0.5">{order.phone}</div>
                            <div className="text-zinc-600 mt-1 line-clamp-2 italic text-[11px]">
                              {order.location}
                            </div>
                            {order.email && (
                              <div className="text-[#86868b] text-[10px] mt-0.5">{order.email}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 max-w-xs">
                            <div className="space-y-1">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex justify-between gap-2 text-zinc-700">
                                  <span className="font-medium truncate">{item.product_title}</span>
                                  <span className="text-[#86868b] whitespace-nowrap">
                                    ×{item.quantity} (${(item.price_at_purchase * item.quantity).toFixed(2)})
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-[#1d1d1f] text-sm">
                              ${order.total_amount.toFixed(2)}
                            </div>
                            <span className="mt-1 inline-block rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600">
                              {order.payment_method}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-[#86868b] whitespace-nowrap">
                            {formattedDate}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              {isUpdating && <Loader2 size={14} className="animate-spin text-zinc-500" />}
                              <select
                                disabled={isUpdating}
                                value={order.status}
                                onChange={(e) =>
                                  handleStatusChange(
                                    order.id,
                                    e.target.value as Order["status"]
                                  )
                                }
                                className={`rounded-xl border px-3 py-1.5 text-xs font-semibold focus:outline-none transition-all cursor-pointer ${getStatusBadge(
                                  order.status
                                )}`}
                              >
                                <option value="pending">Pending</option>
                                <option value="shipped">Shipped</option>
                                <option value="done">Done</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SHOP PRODUCTS CATALOG MANAGEMENT */}
      {activeTab === "products" && (
        <div className="space-y-6">
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Search Box */}
            <div className="relative flex-1 max-w-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#86868b]">
                <Search size={15} />
              </div>
              <input
                type="text"
                placeholder="Search products by title or description..."
                value={productSearchQuery}
                onChange={(e) => setProductSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-9 pr-3 text-xs text-[#1d1d1f] placeholder:text-[#86868b] focus:border-zinc-900 focus:outline-none transition-all"
              />
            </div>

            {/* Add New Product Button */}
            <button
              onClick={openAddProductModal}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-medium text-white shadow-xs hover:bg-zinc-800 transition-colors"
            >
              <Plus size={16} />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-12 text-center text-[#86868b]">
              <p className="text-sm font-medium text-[#1d1d1f]">No products found</p>
              <p className="mt-1 text-xs">
                {productSearchQuery
                  ? "Try searching for a different product keyword."
                  : "Click 'Add New Product' to create your first store product."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => {
                const isDeleting = deletingProductId === product.id;

                return (
                  <div
                    key={product.id}
                    className="flex flex-col justify-between rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs"
                  >
                    <div>
                      {/* Product Image */}
                      <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-zinc-100 mb-4">
                        <img
                          src={product.image_url}
                          alt={product.title}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Title & Price */}
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base font-semibold text-[#1d1d1f] truncate">
                          {product.title}
                        </h3>
                        <span className="text-base font-semibold text-zinc-900 whitespace-nowrap">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>

                      <p className="mt-2 text-xs text-[#86868b] leading-relaxed line-clamp-3">
                        {product.description || "No description provided."}
                      </p>
                    </div>

                    {/* Actions: Edit & Delete */}
                    <div className="mt-6 flex items-center justify-end gap-2 border-t border-zinc-100 pt-4">
                      <button
                        onClick={() => openEditProductModal(product)}
                        className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
                      >
                        <Edit2 size={13} />
                        <span>Edit</span>
                      </button>

                      <button
                        disabled={isDeleting}
                        onClick={() => handleDeleteProduct(product.id)}
                        className="inline-flex items-center gap-1 rounded-xl bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                      >
                        {isDeleting ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <Trash2 size={13} />
                        )}
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-xs"
            onClick={() => setIsProductModalOpen(false)}
          />

          <div className="relative w-full max-w-lg rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-2xl z-10 animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Package size={18} className="text-zinc-900" />
                <h3 className="text-base font-semibold text-[#1d1d1f]">
                  {editingProduct ? `Edit Product #${editingProduct.id}` : "Add New Store Product"}
                </h3>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="rounded-lg p-1 text-[#86868b] hover:bg-zinc-100 hover:text-[#1d1d1f]"
              >
                <X size={18} />
              </button>
            </div>

            {prodError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
                {prodError}
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4">
              {/* Product Title */}
              <div>
                <label className="block text-xs font-medium text-[#1d1d1f] mb-1">
                  Product Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wireless Ergonomic Keyboard"
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                  className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 px-3 text-xs text-[#1d1d1f] focus:border-zinc-900 focus:outline-none"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-medium text-[#1d1d1f] mb-1">
                  Price ($ USD) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#86868b]">
                    <DollarSign size={15} />
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="99.99"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-8 pr-3 text-xs text-[#1d1d1f] focus:border-zinc-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-medium text-[#1d1d1f] mb-1">
                  Image URL <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#86868b]">
                    <ImageIcon size={15} />
                  </div>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/photo-..."
                    value={productForm.image_url}
                    onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-8 pr-3 text-xs text-[#1d1d1f] focus:border-zinc-900 focus:outline-none"
                  />
                </div>
                <p className="mt-1 text-[11px] text-[#86868b]">
                  Provide a direct image URL (e.g., Unsplash, Cloudinary, etc.)
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-[#1d1d1f] mb-1">
                  Description
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 pt-2.5 text-[#86868b]">
                    <FileText size={15} />
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Provide details about features, specifications..."
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-8 pr-3 text-xs text-[#1d1d1f] focus:border-zinc-900 focus:outline-none resize-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-medium text-[#1d1d1f] hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={prodLoading}
                  className="flex items-center gap-1.5 rounded-xl bg-zinc-900 px-5 py-2.5 text-xs font-medium text-white shadow-xs hover:bg-zinc-800 disabled:opacity-50"
                >
                  {prodLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <span>{editingProduct ? "Update Product" : "Save Product"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-xs"
            onClick={() => setIsPasswordModalOpen(false)}
          />

          <div className="relative w-full max-w-md rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-2xl z-10 animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Key size={18} className="text-zinc-900" />
                <h3 className="text-base font-semibold text-[#1d1d1f]">
                  Change Password ({adminId})
                </h3>
              </div>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="rounded-lg p-1 text-[#86868b] hover:bg-zinc-100 hover:text-[#1d1d1f]"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-[#86868b] mb-4">
              Update password for logged in admin account <strong className="text-zinc-800">{adminId}</strong>. Note: <code className="font-mono text-zinc-700">admin_id</code> cannot be changed.
            </p>

            {passError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
                {passError}
              </div>
            )}

            {passSuccess && (
              <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-700">
                {passSuccess}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#1d1d1f] mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 px-3 text-xs text-[#1d1d1f] focus:border-zinc-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1d1d1f] mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 px-3 text-xs text-[#1d1d1f] focus:border-zinc-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1d1d1f] mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 px-3 text-xs text-[#1d1d1f] focus:border-zinc-900 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-medium text-[#1d1d1f] hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passLoading}
                  className="flex items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-medium text-white shadow-xs hover:bg-zinc-800 disabled:opacity-50"
                >
                  {passLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <span>Save Password</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
