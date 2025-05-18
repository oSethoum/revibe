import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./public/home.page";
import AuthLayout from "@/layout/auth.layout";
import LoginPage from "./auth/login.page";
import RegisterPage from "./auth/register.page";

import AdminLayout from "@/layout/admin.layout";
import AdminDashboardPage from "./admin/dashboard.page";
import AdminCategoriesPage from "./admin/categories.page";
import AdminProductPage from "./admin/products.page";
import AdminClientsPage from "./admin/clients.page";

import SellerDashboardPage from "./seller/dashboard.page";
import SellerLayout from "@/layout/seller.layout";
import SellerProductsPage from "./seller/products.page";
import SellerOrdersPage from "./seller/orders.page";
import AdminSellersPage from "./admin/sellers.page";
import { userStore } from "@/lib/store/user-store";

export default function Router() {
  const { refresh } = userStore();
  refresh();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" Component={AuthLayout}>
          <Route path="/auth/login" Component={LoginPage} />
          <Route path="/auth/register" Component={RegisterPage} />
        </Route>
        <Route path="/seller" Component={SellerLayout}>
          <Route path="/seller/dashboard" Component={SellerDashboardPage} />
          <Route path="/seller/products" Component={SellerProductsPage} />
          <Route path="/seller/orders" Component={SellerOrdersPage} />
        </Route>
        <Route path="/admin" Component={AdminLayout}>
          <Route path="/admin/dashboard" Component={AdminDashboardPage} />
          <Route path="/admin/categories" Component={AdminCategoriesPage} />
          <Route path="/admin/products" Component={AdminProductPage} />
          <Route path="/admin/clients" Component={AdminClientsPage} />
          <Route path="/admin/orders" Component={AdminClientsPage} />
          <Route path="/admin/sellers" Component={AdminSellersPage} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
