import { Route, Routes } from "react-router-dom";
import PrivateRouter from "./PrivateRouter";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Login from "../pages/Authentication/Login";
import Profile from "../pages/Authentication/Profile";
import Home from "../pages/Home/Home";

import Signup from "../pages/Authentication/Signup";
import ChangePassword from "../pages/Authentication/ChangePassword";
import FoodDetail from "../pages/Reciepe/FoodDetails";
import MySubscriptionOrders from "../pages/Home/Subscription/MySubscriptionOrders";
import MyOrders from "../pages/Home/MyOrder/MyOrders";
import ProductsPage from "../pages/Home/MyOrder/ProductPage";
import ProductDetailsPage from "../pages/Home/MyOrder/ProductDetailsPage";
import CartPage from "../pages/Home/MyOrder/CartPage";
import OrderSuccess from "../pages/Home/MyOrder/OrderSuccess";
import OrderDetails from "../pages/Home/MyOrder/OrderDetails";
import RecipePage from "../pages/Reciepe/RecipePage";
import AllProducts from "../pages/Home/MyOrder/AllProducts";
import ServicesPage from "../pages/Home/Subscription/ServicesPage";
import ErrorPage from "../pages/ErrorPage";
import Contact from "../pages/Contact/Contact";

export default function Routers() {
  return (
    <>
      <Header />
      {/* <Suspense
        fallback={
          <div>
            <Loader />
          </div>
        }
      > */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/all-products" element={<AllProducts />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/recipes" element={<RecipePage />} />

        <Route path="*" element={<ErrorPage />} />

        <Route element={<PrivateRouter />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/food-detail/:id" element={<FoodDetail />} />

          <Route path="/mysub-order" element={<MySubscriptionOrders />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/my-orders/:id" element={<OrderDetails />} />
        </Route>
      </Routes>
      {/* </Suspense> */}
      <Footer />
    </>
  );
}
