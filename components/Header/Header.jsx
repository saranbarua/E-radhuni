import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import Button from "../Button/Button";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Dropdown from "../Dropdown/Dropdown";
import { logoutUser } from "../../src/redux/features/Authentication/loginActions";
import images from "../../src/assets/image";
import { motion } from "framer-motion";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import {
  clearCart,
  closeCart,
  removeFromCart,
  toggleCart,
} from "../../src/redux/features/Authentication/cartSlice";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    window.location.href = "/login";
  };
  const { isLoggedIn } = useSelector((state) => state.login);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };
  //dropdwon option
  const options = [
    { label: "My Profile", value: "profile" },
    { label: "Subscriptions", value: "mysub-order" },
    { label: "Log out", value: "out" },
  ];

  const handleSelect = (option) => {
    if (option.value === "profile") {
      navigate("/profile");
    } else if (option.value === "mysub-order") {
      navigate("/mysub-order");
    } else if (option.value === "out") {
      handleLogout();
    }
  };
  const token = Cookies.get("token");

  const handleDrawerCheckout = () => {
    if (!isLoggedIn || !token) {
      dispatch(closeCart());
      toast.error("Checkout করতে হলে আগে Login করুন");
      navigate("/login", { state: { from: "/cart" } });
      // চাইলে from: location.pathname দিতে পারেন
      return;
    }

    dispatch(closeCart());
    navigate("/cart"); // cart page দেখাবে
    // অথবা: navigate("/checkout"); যদি আলাদা payment page থাকে
  };

  const { items, ui } = useSelector((state) => state.cart);
  const cartOpen = ui?.isOpen;

  const cartCount = items.reduce((sum, it) => sum + (it.qty || 1), 0);
  const cartTotal = items.reduce(
    (sum, it) => sum + Number(it.price || 0) * (it.qty || 1),
    0
  );

  const money = (n) => `৳${Number(n || 0).toLocaleString("en-BD")}`;

  return (
    <>
      <header className="font-serif bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to={"/"}>
            <img src={images.logo} alt="Logo" className="h-8 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden text-gray-500  md:flex gap-6">
            <Link
              to={"/services"}
              className="hover:text-[#8f0910] font-medium cursor-pointer transition-colors duration-300"
            >
              Our Services
            </Link>
            <Link
              to={"/recipes"}
              className=" hover:text-[#8f0910] font-medium cursor-pointer transition-colors duration-300"
            >
              Recipe
            </Link>
            <Link
              to={"/all-products"}
              className=" hover:text-[#8f0910] font-medium cursor-pointer transition-colors duration-300"
            >
              Products
            </Link>
            <Link
              to={"/contact"}
              className=" hover:text-[#8f0910] font-medium cursor-pointer transition-colors duration-300"
            >
              Contact Us
            </Link>
            {isLoggedIn ? (
              <Link
                to={"/my-orders"}
                className="hover:text-[#8f0910]  font-medium cursor-pointer transition-colors duration-300"
              >
                My Orders
              </Link>
            ) : null}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            {/* Icons */}
            <div className="flex items-center gap-3">
              {/* <FontAwesomeIcon
                icon={faSearch}
                className="text-lg text-white bg-red-300 p-1 cursor-pointer"
              /> */}
              {/* <FontAwesomeIcon
                icon={faBell}
                className="text-lg text-white bg-red-300 p-1 cursor-pointer"
              />
              <FontAwesomeIcon
                icon={faHeart}
                className="text-lg text-white bg-red-300 p-1 cursor-pointer"
              /> */}
              <button
                type="button"
                onClick={() => dispatch(toggleCart())}
                className="relative"
                aria-label="Open cart"
              >
                <motion.div
                  className="relative"
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <FontAwesomeIcon
                    icon={faShoppingCart}
                    className="text-lg text-white bg-red-300 p-1 cursor-pointer hover:scale-110 hover:bg-red-400 transition-all duration-300"
                  />
                </motion.div>

                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center font-semibold">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </button>
            </div>
            {/* Auth */}
            <div className="relative">
              {isLoggedIn ? (
                <Dropdown options={options} onSelect={handleSelect} />
              ) : (
                <Link
                  to={"/login"}
                  className="flex items-center text-gray-800 hover:text-yellow-500 transition-colors duration-300"
                >
                  <Button
                    title={"Sign In"}
                    className={
                      "rounded-lg font-medium whitespace-nowrap text-white bg-primary hover:bg-primary-light p-2"
                    }
                  />
                </Link>
              )}
            </div>
          </div>
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-primary focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
          >
            <FontAwesomeIcon
              icon={isMobileMenuOpen ? faTimes : faBars}
              size="lg"
            />
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden text-gray-500  bg-white shadow-md">
            <ul className="flex flex-col space-y-4 px-4 py-4">
              <li>
                <Link
                  to={"/services"}
                  className=" font-medium hover:text-primary-light transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Our Services
                </Link>
              </li>
              <li>
                <Link
                  to={"/recipes"}
                  className=" font-medium hover:text-primary-light transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Recipes
                </Link>
              </li>
              <li>
                <Link
                  to={"/all-products"}
                  className=" font-medium hover:text-primary-light transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to={"/contact"}
                  className=" font-medium hover:text-primary-light transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to={"/my-orders"}
                  className=" font-medium hover:text-primary-light transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Orders
                </Link>
              </li>

              {isLoggedIn ? (
                <>
                  <li>
                    <Link
                      to={"/profile"}
                      className=" font-medium hover:text-[#2A3335] text-white transition-colors duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/mysub-order"}
                      className=" font-medium hover:text-[#2A3335] text-white transition-colors duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {" "}
                      Subscriptions
                    </Link>
                  </li>
                  <li>
                    <div
                      className="text-gray-800 font-medium hover:text-[#2A3335] transition-colors duration-300"
                      onClick={() => dispatch(logoutUser())}
                    >
                      Logout
                    </div>
                  </li>
                </>
              ) : (
                <Link
                  to={"/login"}
                  className="flex items-center text-gray-800 hover:text-yellow-500 transition-colors duration-300"
                >
                  <Button
                    title={"Sign In"}
                    className={
                      "rounded-lg font-medium whitespace-nowrap text-white bg-primary hover:bg-primary-light p-2"
                    }
                  />
                </Link>
              )}
            </ul>
          </nav>
        )}
      </header>
      {/* Mini Cart Drawer */}
      {cartOpen && (
        <motion.div
          className="fixed inset-0 z-[60]"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Backdrop */}
          <button
            onClick={() => dispatch(closeCart())}
            className="absolute inset-0 bg-black/40"
            aria-label="Close cart"
          />

          {/* Panel */}
          <div className="absolute right-0 top-0 h-full w-[92%] sm:w-[420px] bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400">
                  Shopping Cart
                </p>
                <p className="text-sm font-extrabold text-gray-900">
                  {cartCount} item{cartCount === 1 ? "" : "s"}
                </p>
              </div>

              <button
                onClick={() => dispatch(closeCart())}
                className="h-10 w-10 rounded-xl border border-gray-200 bg-white hover:bg-gray-50"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 h-[calc(100%-170px)] overflow-auto">
              {items.length === 0 ? (
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center">
                  <p className="text-sm font-extrabold text-gray-900">
                    Cart is empty
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Add some products to see them here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((it) => (
                    <div
                      key={it.id}
                      className="flex gap-3 rounded-2xl border border-gray-200 bg-white p-3"
                    >
                      <img
                        src={
                          it.imageUrl ||
                          "https://dummyimage.com/120x120/e5e7eb/111827&text=Item"
                        }
                        alt={it.name}
                        className="h-16 w-16 rounded-xl object-cover border"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-extrabold text-gray-900 line-clamp-1">
                          {it.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {money(it.price)} × {it.qty}
                        </p>

                        <div className="mt-2 flex items-center justify-between">
                          <p className="text-sm font-extrabold text-gray-900">
                            {money(Number(it.price || 0) * (it.qty || 1))}
                          </p>

                          <button
                            onClick={() => dispatch(removeFromCart(it.id))}
                            className="text-xs font-bold text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-700">Total</p>
                <p className="text-lg font-extrabold text-gray-900">
                  {money(cartTotal)}
                </p>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  disabled={items.length === 0}
                  onClick={() => dispatch(clearCart())}
                  className="flex-1 rounded-2xl border border-gray-200 bg-white py-3 text-sm font-extrabold text-gray-900 hover:bg-gray-50 disabled:opacity-50"
                >
                  Clear
                </button>

                <button
                  disabled={items.length === 0}
                  onClick={handleDrawerCheckout}
                  className="flex-1 rounded-2xl bg-[#8f0910] py-3 text-sm font-extrabold text-white hover:opacity-95 disabled:opacity-50"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Header;
