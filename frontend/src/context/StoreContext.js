

import { createContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

export const StoreContext = createContext();

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Backend URL - development vs production
  const url = process.env.NODE_ENV === 'development' 
    ? "http://localhost:5000" 
    : process.env.REACT_APP_BACKEND_URL;

  // ✅ useCallback wrap karo
  const fetchFoodList = useCallback(async () => {
    try {
      const response = await axios.get(url + "/api/food/list");
      setFoodList(response.data.data || []);
    } catch (error) {
      console.error("Food list error:", error);
    }
  }, [url]); // ✅ url dependency

  // ✅ useCallback wrap karo
  const loadCartData = useCallback(async (token) => {
    try {
      const response = await axios.post(
        url + "/api/cart/get",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartItems(response.data.cartData || {});
    } catch (error) {
      console.error("Load cart error:", error);
    }
  }, [url]); // ✅ url dependency

  // ✅ Fixed useEffect
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchFoodList();

      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        const isValidFormat = savedToken.split('.').length === 3;
        if (isValidFormat) {
          setToken(savedToken);
          await loadCartData(savedToken);
        } else {
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };
    
    loadData();
  }, [fetchFoodList, loadCartData]); // ✅ dependencies included

  // Add to cart function
  const addToCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
    if (token) {
      try {
        await axios.post(
          url + "/api/cart/add",
          { itemId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error("Add to cart error:", error);
      }
    }
  };

  // Remove from cart function
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const newCart = { ...prev };
      if (newCart[itemId] > 0) {
        newCart[itemId] -= 1;
        if (newCart[itemId] === 0) delete newCart[itemId];
      }
      return newCart;
    });

    if (token) {
      try {
        await axios.post(
          url + "/api/cart/remove",
          { itemId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error("Remove from cart error:", error);
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const contextValue = {
    food_list,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    loading,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;























































