import type { Metadata } from "next";
import { CartProvider } from "@/context/CartContext";
import ShopNavbar from "@/components/shop/ShopNavbar";

export const metadata: Metadata = {
  title: "E-Commerce Storefront",
  description: "Browse products and place cash on delivery orders.",
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-[#fbfbfd] text-[#1d1d1f]">
        <ShopNavbar />
        <main>{children}</main>
      </div>
    </CartProvider>
  );
}
