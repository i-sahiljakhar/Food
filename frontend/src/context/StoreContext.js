import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

  const url = "http://localhost:5000";

  const [food_list, setFoodList] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");

  const fetchFoodList = async () => {

    const response = await axios.get(url + "/api/food/list");
    setFoodList(response.data.data);

  };

  useEffect(() => {

    async function loadData() {

      await fetchFoodList();

      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
      }

    }

    loadData();

  }, []);
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
  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    url,
    token,
    setToken,
    getTotalCartAmount
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );

};

export default StoreContextProvider;
