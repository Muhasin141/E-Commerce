import React from "react";
import { BrowserRouter, Routes, Route, RouterProvider } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext"; // Your context file
// ⭐ NEW: Import ToastContainer and CSS
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --- Layout Components ---
import Navbar from "./components/Nav.js"; // The navigation bar

// --- Page Components ---
import HomePage from "./pages/HomePage.js"; // Required for Feature 1 (Categories)
import ProductsPage from "./pages/ProductsPage.js"; // Required for Feature 2 (Listing & Filters)
import ProductDetails from "./pages/ProductDetails.js"; // Required for Feature 4
import CartPage from "./pages/CartPage.js"; // Required for Feature 6
import WishlistPage from "./pages/Wishlist.js"; // Required for Feature 5
import UserProfile from "./pages/UserProfile.js"; // Required for Feature 9 (Profile & Address)
import OrderConfirmPage from "./pages/OrderConfirmationPage";
import OrderDetails from "./pages/OrderDetails";
import CheckoutPage from "./pages/CheckoutPage";

import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./components/Footer";
// import "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";

function App() {
  return (
    // 1. BrowserRouter enables client-side routing
    <BrowserRouter>
      {/* 2. AppProvider wraps everything to provide global state access */}
      <AppProvider>
        <div className="App">
          {/* ⭐ NEW: ToastContainer setup (This replaces your old custom Alerts) */}
          <ToastContainer
            position="top-right" // Position alerts in the top right
            autoClose={3000} // Default auto-close time (3 seconds)
            hideProgressBar={false}
            newestOnTop={true} // New alerts appear on top
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored" // Use the default color themes (success=green, danger=red, etc.)
          />

          {/* Navbar and ToastContainer are placed outside of <Routes> so they appear on every page */}
          <Navbar />

          {/* Main content area, adding padding-top to clear the fixed-top Navbar */}
          <main style={{ padding: "20px", marginTop: "70px" }}>
            {/* 3. Routes defines the possible paths in your application */}
            <Routes>
              {/* Home Page (Feature 1) */}
              <Route path="/" element={<HomePage />} />

              {/* Product Listing Page (Feature 2 & 3) */}
              <Route path="/products" element={<ProductsPage />} />

              {/* Product Details Page (Feature 4). The :productId is a URL parameter. */}
              <Route path="/products/:productId" element={<ProductDetails />} />

              {/* Cart Management Page (Feature 6) */}
              <Route path="/cart" element={<CartPage />} />

              {/* Wishlist Management Page (Feature 5) */}
              <Route path="/wishlist" element={<WishlistPage />} />

              {/* User Profile, Address, and Orders (Features 7, 8, 9) */}
              <Route path="/profile" element={<UserProfile />} />

              {/* Order Confirmation Page (After checkout) */}
              <Route
                path="/order-success/:orderId"
                element={<OrderConfirmPage />}
              />

              {/* Specific Order Details Page */}
              <Route path="/order/:orderId" element={<OrderDetails />} />

              <Route path="/checkout" element={<CheckoutPage />} />

              {/* 404 Page (Always good practice) */}
              <Route
                path="*"
                element={
                  <h2 className="text-center mt-5">404 - Page Not Found</h2>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
