// AppContext.js

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
// ⭐ NEW: Import toast for React-Toastify
import { toast } from "react-toastify";

// Assuming this URL is correct:
const API_URL = "https://e-commerce-app-blush-three.vercel.app/api";

// --- Utility function: fetchData ---
const fetchData = async (url, method = "GET", data = null) => {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

const initialState = {
  products: [],
  cart: [],
  wishlist: [],
  // REMOVED alerts from initialState
  userDetails: null, // Includes addresses
  orders: [],
  loading: true,
  searchTerm: "",
};

const AppContext = createContext(initialState);
export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState(initialState.products);
  const [cart, setCart] = useState(initialState.cart);
  const [wishlist, setWishlist] = useState(initialState.wishlist);
  // REMOVED alerts state and setAlerts hook
  const [userDetails, setUserDetails] = useState(initialState.userDetails);
  const [orders, setOrders] = useState(initialState.orders);
  const [loading, setLoading] = useState(initialState.loading);
  const [searchTerm, setSearchTerm] = useState(initialState.searchTerm);

  // --- 1. Alerts (Using React-Toastify) ---

  const addAlert = useCallback((message, variant = "info", timeout = 3000) => {
    // 🗑️ REMOVED: State management logic for alerts

    // ⭐ NEW: Use toast functions based on the variant
    switch (variant) {
      case "success":
        toast.success(message, { autoClose: timeout });
        break;
      case "danger":
        toast.error(message, { autoClose: timeout });
        break;
      case "warning":
        toast.warn(message, { autoClose: timeout });
        break;
      default: // 'info' or any other variant
        toast.info(message, { autoClose: timeout });
        break;
    }
  }, []); // addAlert no longer depends on setAlerts

  // --- 2. Product Fetching & Initial Data Load ---

  const fetchProducts = useCallback(
    async (queryParams = "") => {
      try {
        const url = `${API_URL}/products${queryParams}`;
        const productRes = await fetchData(url, "GET");
        setProducts(productRes.products);
      } catch (error) {
        console.error("Error fetching products:", error);
        addAlert(`Failed to load products. (${error.message})`, "danger");
        setProducts([]);
      }
    },
    [addAlert]
  );

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // Load stable user/shopping data concurrently
        const [cartRes, wishlistRes, profileRes, orderRes] = await Promise.all([
          fetchData(`${API_URL}/cart`),
          fetchData(`${API_URL}/wishlist`),
          fetchData(`${API_URL}/user/profile`),
          fetchData(`${API_URL}/user/orders`),
        ]);

        await fetchProducts(); // Separate call to load product list

        setCart(cartRes.cart);
        setWishlist(wishlistRes.wishlist);
        setUserDetails(profileRes);
        setOrders(orderRes.orders);
      } catch (error) {
        console.error("Error fetching initial data (non-product):", error);
        addAlert(
          `Failed to load user or shopping data. (${error.message})`,
          "danger"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [addAlert, fetchProducts]);

  // --- 3. Cart Management ---
  const updateCart = async (productId, action, size = null) => {
    try {
      let res;
      const data = { productId, size };

      if (action === "ADD") {
        res = await fetchData(`${API_URL}/cart`, "POST", data);
        addAlert("Item added to cart!", "success");
      } else if (action === "REMOVE") {
        const sizeQuery = size ? `&size=${encodeURIComponent(size)}` : "";
        const url = `${API_URL}/cart/${productId}?${sizeQuery}`;
        res = await fetchData(url, "DELETE");

        addAlert("Item removed from cart.", "warning");
      } else if (action === "INCREMENT" || action === "DECREMENT") {
        res = await fetchData(`${API_URL}/cart/quantity`, "POST", {
          ...data,
          action: action.toLowerCase(),
        });
        const isRemoved =
          res.cart.findIndex(
            (item) => item.product._id === productId && item.size === size
          ) === -1;

        if (isRemoved && action === "DECREMENT") {
          addAlert("Item removed from cart.", "warning");
        } else {
          addAlert(`Quantity ${action.toLowerCase()}d.`, "info");
        }
      } else {
        throw new Error("Invalid cart action provided.");
      }

      setCart(res.cart);
    } catch (error) {
      console.error(`Error updating cart (${action}):`, error);
      addAlert(`Failed to update cart. (${error.message})`, "danger");
    }
  };

  const clearCart = useCallback(async () => {
    try {
      const res = await fetchData(`${API_URL}/cart/clear`, "DELETE");

      setCart(res.cart);

      addAlert("Your shopping cart has been emptied.", "warning");
    } catch (error) {
      console.error("Error clearing cart:", error);
      addAlert(`Failed to clear cart. (${error.message})`, "danger");
    }
  }, [addAlert]);

  // --- 4. Wishlist Management ---
  const updateWishlist = async (productId, action, size = null) => {
    try {
      let res;
      const data = { productId, size, action };

      if (action === "ADD" || action === "REMOVE") {
        res = await fetchData(`${API_URL}/wishlist`, "POST", data);
        addAlert(
          action === "ADD" ? "Added to wishlist!" : "Removed from wishlist.",
          action === "ADD" ? "info" : "warning"
        );
      } else {
        throw new Error("Invalid wishlist action.");
      }
      setWishlist(res.wishlist);
    } catch (error) {
      console.error(`Error updating wishlist (${action}):`, error);
      addAlert(`Failed to update wishlist. (${error.message})`, "danger");
    }
  };

  const clearWishlist = useCallback(async () => {
    try {
      const res = await fetchData(`${API_URL}/wishlist/clear`, "DELETE");
      setWishlist(res.wishlist);
      addAlert("Wishlist cleared.", "warning");
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      addAlert(`Failed to clear wishlist. (${error.message})`, "danger");
    }
  }, [addAlert]);

  // --- 5. Address Management (CRUD) ---
  const updateAddresses = useCallback(
    async (action, addressId, data) => {
      let method;
      let url;
      let payload = null;

      if (action === "ADD" || action === "UPDATE") {
        payload = data;
      }

      if (action === "ADD") {
        method = "POST";
        url = `${API_URL}/user/addresses`;
      } else if (action === "UPDATE") {
        method = "PUT";
        url = `${API_URL}/user/addresses/${addressId}`;
      } else if (action === "DELETE") {
        method = "DELETE";
        url = `${API_URL}/user/addresses/${addressId}`;
      } else {
        throw new Error("Invalid address action.");
      }

      try {
        await fetchData(url, method, payload);

        const profileRes = await fetchData(`${API_URL}/user/profile`);
        setUserDetails(profileRes);
        let successMessage = "";

        switch (action) {
          case "ADD":
            successMessage = "Address added successfully.";
            break;
          case "UPDATE":
            successMessage = "Address updated successfully.";
            break;
          case "DELETE":
            successMessage = "Address deleted successfully.";
            break;
          default:
            successMessage = "Address updated.";
        }

        addAlert(successMessage, "success");
      } catch (error) {
        console.error(`Error ${action} address:`, error);
        addAlert(
          `Failed to ${action.toLowerCase()} address. (${error.message})`,
          "danger"
        );
      }
    },
    [addAlert]
  );

  // --- 6. Checkout & Orders ---
  const placeOrder = async (selectedAddressId, totalAmount) => {
    try {
      const data = { selectedAddressId, totalAmount };

      const res = await fetchData(`${API_URL}/checkout`, "POST", data);

      if (!res.orderId) {
        throw new Error("Backend did not return an order ID.");
      }

      // After successful checkout, refresh cart and orders
      const [cartRes, orderRes] = await Promise.all([
        fetchData(`${API_URL}/cart`),
        fetchData(`${API_URL}/user/orders`),
      ]);
      setCart(cartRes.cart);
      setOrders(orderRes.orders);

      return res;
    } catch (error) {
      console.error("Checkout failed:", error);
      addAlert(`Checkout failed. (${error.message})`, "danger");
      return false;
    }
  };

  // --- Context Value ---
  const contextValue = {
    // State variables
    state: {
      products,
      cart,
      wishlist,
      // REMOVED alerts from state object
      loading,
      userDetails,
      orders,
      searchTerm,
    },
    // Handlers & Actions
    fetchProducts,
    updateCart,
    updateWishlist,
    clearWishlist,
    updateAddresses,
    placeOrder,
    addAlert,
    setSearchTerm,
    clearCart,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
