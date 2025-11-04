
import { createContext, useEffect, useState } from "react";
import axios from 'axios';
// import { food_list } from "../assets/assets";
// import { food_list }from "../assets/assets";

export const StoreContext = createContext();

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken, ] = useState("");
  const [loaded, LoadData] = useState(true);
  const [food_list,setFoodList] = useState([])


  const url = "http://localhost:4000"
// axios.get("http://localhost:5000/api/cart")

  // const url = https://food-del-backend-jen2.onrender.com;
// const url = 'https://food-del-backend-jen2.onrender.com';

  const addToCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
    if(token){
      await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})
    }
  }

//  const addToCart = async (itemId) => {
//   setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));

//   if (token) {
//     try {
//       await axios.post(
//         url + "/api/cart/add",
//         { itemId }, // body
//         { headers: { token } } // header
//       );
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//     }
//   }
// };
const removeFromCart = async (itemId) =>{
  setCartItems((prev)=>({
     ...prev,[itemId]: prev[itemId] - 1
  }));
  if(token){
    await axios.post(url+'/api/cart/remove',{itemId},{headers:{token}})
  }
}
  // const removeFromCart =async (itemId) => {
  // //   setCartItems((prev) => {
  // // //     const updatedCartItems = { ...prev };
  // // //     if (updatedCartItems[itemId] > 0) {
  // // //       updatedCartItems[itemId]--;
  // // //     }
  // // //     return updatedCartItems;
  // // //   });
  // // // };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = food_list.find((product) => product._id === item);
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  // const fetchFoodList = async () => {
  //   try {
  //     const response = await axios.get(url + '/api/food/list');
  //     LoadData(true);
  //     return response.data.data;
  //   } catch (error) {
  //     console.error("Error fetching food list:", error);
  //     return [];
  //   }
  // };

  const fetchFoodList = async () => {
  try {
    const response = await axios.get(url + "/api/food/list");
    LoadData(true); // ✅ use correct setter
    return response.data.data; // ✅ return list from backend
  } catch (error) {
    console.error("Error fetching food list:", error);
    LoadData(false); // optional: mark as failed
    return []; // fallback empty list
  }
};

  const loadCartData = async (token) =>{
    const response = await axios.post(url+"/api/cart/get",{},{headers:{token}})
setCartItems(response.data.cartData);

  }

  // useEffect(() => {
  //   async function loadData() {
  //     await fetchFoodList();
  //     const storedToken = localStorage.getItem("token");
  //     if (storedToken) {
  //       setToken(storedToken);
  //       await loadCartData(storedToken); // Assuming loadCartData exists
  //     }
  //   }
  //   loadData();
  // }, []);
  
  
// useEffect(()=>{
//   async function loadData(){
//     await fetchFoodList();
//     if(localStorage.getItem("token")){
//       setToken(localStorage.getItem("token"));
//       await loadCartData(localStorage.getItem("token"))
//     }
//   }
//   loadData();
// })
  useEffect(() => {
    async function loadData() {
      const fetchedFoodList = await fetchFoodList();
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCartData(localStorage.getItem("token"))
      }
      if (fetchedFoodList.length > 0) {
        setFoodList(fetchedFoodList);
   
      }
    }
    loadData();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    loaded,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;











































































// import { createContext, useEffect, useState } from "react";
// import axios from 'axios';
// import { food_list } from "../assets/assets";

// export const StoreContext = createContext(null);

// const StoreContextProvider = (props) => {
//   const [cartItems, setCartItems] = useState({});
//   const [token, setToken] = useState("");
//   const [loaded, setLoaded] = useState(false);
//   const [food_list, setFoodList] = useState(''); // Add missing setFoodList declaration

//   const url = 'http://localhost:4000';

//   const addToCart = (itemId) => {
//     setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
//   };

//   const removeFromCart = (itemId) => {
//     setCartItems((prev) => {
//       const updatedCartItems = { ...prev };
//       if (updatedCartItems[itemId] > 0) {
//         updatedCartItems[itemId]--;
//       }
//       return updatedCartItems;
//     });
//   };

//   const getTotalCartAmount = () => {
//     let totalAmount = 0;
//     for (const item in cartItems) {
//       if (cartItems[item] > 0) {
//         const itemInfo = food_list.find((product) => product._id === item);
//         totalAmount += itemInfo.price * cartItems[item];
//       }
//     }
//     return totalAmount;
//   };

//   const fetchFoodList = async () => {
//     try {
//       const response = await axios.get(url + '/api/food/list');
//       setLoaded(true);
//       setFoodList(response.data.data); // Update food_list state with fetched data
//     } catch (error) {
//       console.error("Error fetching food list:", error);
//       setFoodList([]); // Set an empty array in case of error
//     }
//   };
  
//   useEffect(() => {
//     async function loadData() {
//       const fetchedFoodList = await fetchFoodList();
//       if (localStorage.getItem("token")) {
//         setToken(localStorage.getItem("token"));
//       }
//       if (fetchedFoodList.length > 0) {
//         setFoodList(fetchedFoodList);
//       }
//     }
//     loadData();
//   }, []);

//   const contextValue = {
//     food_list,
//     cartItems,
//     setCartItems,
//     addToCart,
//     removeFromCart,
//     getTotalCartAmount,
//     token,
//     setToken,
//     loaded,
//   };

//   return (
//     <StoreContext.Provider value={contextValue}>
//       {props.children}
//     </StoreContext.Provider>
//   );
// };

// export default StoreContextProvider;






// // import { createContext, useEffect, useState } from "react";
// // import axios from 'axios'
// // import { food_list } from "../assets/assets";
// // export const StoreContext = createContext(null);

// // const StoreContextProvider = (props) => {
// //   const [cartItems, setCartItems] = useState({});
// // const url = 'http://localhost:4000'
// // const [token,setToken] = useState("");
// // const [food_list,setFoodList] = useState('')




// //   const addToCart = (itemId) => {
// //     if (!cartItems[itemId]) {
// //       setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
// //     } else {
// //       setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
// //     }
// //   };



// //   const removeFromCart = (itemId) => {
// //     setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
// //   };



// //   const getTotalCartAmount = () => {
// //     let totalAmount = 0;
// //     for (const item in cartItems) {
// //       if (cartItems[item] > 0) {
// //         let itemInfo = food_list.find((product) => product._id === item);
// //         totalAmount += itemInfo.price * cartItems[item];
// //       }
// //     }
// //     return totalAmount;
// //   };


// //   const fetchFoodList = async () =>{
// //     const response = await axios.get(url+'/api/food/list');
// //     setFoodList(response.data.data)
// //   }

// // useEffect(()=>{
 
// //   async function loadData(){
// //     await fetchFoodList();
// //     if (localStorage.getItem("token")) {
// //       setToken(localStorage.getItem("token"));
// //     }
// //   }
// //   loadData()
// // },[])

// //   const contextValue = {
// //     food_list,
// //     cartItems,
// //     setCartItems,
// //     addToCart,
// //     removeFromCart,
// //     getTotalCartAmount,
// //    url,
// //    token,
// //   setToken
// //   };

// //   return (
// //     <StoreContext.Provider value={contextValue}>
// //       {props.children}
// //     </StoreContext.Provider>
// //   );
// // };

// // export default StoreContextProvider;

// import { createContext, useEffect, useState } from "react";
// import axios from "axios";
// import { food_list as staticFoodList } from "../assets/assets";

// export const StoreContext = createContext();

// const StoreContextProvider = (props) => {
//   const [cartItems, setCartItems] = useState({});
//   const [token, setToken] = useState("");
//   const [loaded, setLoaded] = useState(true);
//   const [food_list, setFoodList] = useState([]);

//   // ✅ Backend URL (local or deployed)
//   const url = "http://localhost:5000";
//   // const url = "https://food-del-backend-jen2.onrender.com";

//   const addToCart = async (itemId) => {
//     setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
//     if (token) {
//       await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
//     }
//   };

//   const removeFromCart = async (itemId) => {
//     setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
//     if (token) {
//       await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
//     }
//   };

//   const getTotalCartAmount = () => {
//     let totalAmount = 0;
//     for (const item in cartItems) {
//       if (cartItems[item] > 0) {
//         const itemInfo = food_list.find((product) => product._id === item);
//         totalAmount += itemInfo?.price * cartItems[item];
//       }
//     }
//     return totalAmount;
//   };

//   const fetchFoodList = async () => {
//     try {
//       const response = await axios.get(url + "/api/food/list");
//       setLoaded(true);
//       return response.data.data;
//     } catch (error) {
//       console.error("Error fetching food list:", error);
//       return [];
//     }
//   };

//   const loadCartData = async (token) => {
//     try {
//       const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
//       setCartItems(response.data.cartData);
//     } catch (error) {
//       console.error("Error loading cart data:", error);
//     }
//   };

//   useEffect(() => {
//     async function loadData() {
//       const fetchedFoodList = await fetchFoodList();
//       if (localStorage.getItem("token")) {
//         const storedToken = localStorage.getItem("token");
//         setToken(storedToken);
//         await loadCartData(storedToken);
//       }
//       if (fetchedFoodList.length > 0) {
//         setFoodList(fetchedFoodList);
//       }
//     }
//     loadData();
//   }, []);

//   const contextValue = {
//     food_list,
//     cartItems,
//     setCartItems,
//     addToCart,
//     removeFromCart,
//     getTotalCartAmount,
//     url,
//     token,
//     setToken,
//     loaded,
//   };

//   return <StoreContext.Provider value={contextValue}>{props.children}</StoreContext.Provider>;
// };

// export default StoreContextProvider;



