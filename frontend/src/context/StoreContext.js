import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext();

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);
  const [loading, setLoading] = useState(true);

  const url = "http://localhost:5000";

  
  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    if (token) {
      try {
        await axios.post(
          url + "/api/cart/add",
          { itemId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error("Add to cart error:", error.response?.data || error.message);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          setToken("");
        }
      }
    }
  };

 
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 0) - 1, 0),
    }));

    if (token) {
      try {
        await axios.post(
          url + "/api/cart/remove",
          { itemId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error("Remove from cart error:", error.response?.data || error.message);
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };


  const fetchFoodList = async () => {
    try {
      const response = await axios.get(url + "/api/food/list");
      return response.data.data || [];
    } catch (error) {
      console.error("Food list error:", error);
      return [];
    }
  };


  const loadCartData = async (token) => {
    try {
      const response = await axios.post(
        url + "/api/cart/get",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartItems(response.data.cartData || {});
    } catch (error) {
      console.error("Load cart error:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        setToken("");
      }
    }
  };
    useEffect(() => {
    const savedToken = localStorage.getItem("token");
    
    if (savedToken) {
       
        const isValidFormat = savedToken.split('.').length === 3;
        
        if (!isValidFormat) {
            console.log("❌ Invalid token format, clearing...");
            localStorage.removeItem("token");
            setToken("");
        } else {
            console.log("✅ Valid token format");
            setToken(savedToken);
        }
    }
  }, []);


  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const foods = await fetchFoodList();
      setFoodList(foods);

      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        await loadCartData(savedToken);
      }
      setLoading(false);
    };
    loadData();
  }, []);

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


























































// import { createContext, useEffect, useState } from "react";
// import axios from "axios";

// export const StoreContext = createContext();

// const StoreContextProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState({});
//   const [token, setToken] = useState("");
//   const [food_list, setFoodList] = useState([]);

//   const url = "http://localhost:5000";

//   const authHeader = () => ({
//     headers: { Authorization: `Bearer ${token}` },
//   });

//   const addToCart = async (itemId) => {
//     setCartItems((p) => ({ ...p, [itemId]: (p[itemId] || 0) + 1 }));
//     if (!token) return;

//     try {
//       await axios.post(url + "/api/cart/add", { itemId }, authHeader());
//     } catch (e) {
//       console.error(e.response?.data);
//     }
//   };

//   const removeFromCart = async (itemId) => {
//     setCartItems((p) => ({ ...p, [itemId]: Math.max(p[itemId] - 1, 0) }));
//     if (!token) return;

//     try {
//       await axios.post(url + "/api/cart/remove", { itemId }, authHeader());
//     } catch (e) {
//       console.error(e.response?.data);
//     }
//   };

//   const loadCartData = async (savedToken) => {
//     try {
//       const res = await axios.post(
//         url + "/api/cart/get",
//         {},
//         { headers: { Authorization: `Bearer ${savedToken}` } }
//       );
//       setCartItems(res.data.cartData || {});
//     } catch (e) {
//       console.error("Invalid token → logout");
//       localStorage.removeItem("token");
//       setToken("");
//     }
//   };

//   useEffect(() => {
//     const savedToken = localStorage.getItem("token");
//     if (savedToken) {
//       setToken(savedToken);
//       loadCartData(savedToken);
//     }
//   }, []);

//   return (
//     <StoreContext.Provider
//       value={{ cartItems, addToCart, removeFromCart, token }}
//     >
//       {children}
//     </StoreContext.Provider>
//   );
// };

// export default StoreContextProvider;

