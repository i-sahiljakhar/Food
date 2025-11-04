// import userModel from '../models/userModel.js'

// // add items to user cart

// const addToCart = async(req,res) =>{
// try {
//     let userData = await userModel.findById(req.body.userId)
//     let cartData = await userData.cartData;
//     if (!cartData[req.body.itemIdcart]) {
//         cartData[req.body.itemId] = 1;
//     }
//     else{
//         cartData[req.body.itemId] +=1;
//     }
//     await userModel.findByIdAndUpdate(req.body.userId,{cartData});
//     res.json({success:true,message:"Added To cart"});
// } catch (error) {
    
//     console.log(error);
//     res.json({success:false,message:"Error"})
// }
// }



// //remove items from user cart

// const removeFromCart = async (req,res) =>{
// try {
//     let userData = await userModel.findById(req.body.userId)
//     let cartData = await userData.cartData;
//     if (cartData[req.body.itemId]>0) {
//         cartData[req.body.itemId] -= 1;
//     }
//     await userModel.findByIdAndUpdate(req.body.userId,{cartData});
//     res.json({success:true,message:"Removed From Cart"})
// } catch (error) {
//     console.log(Error);
//     res.json({success:false,message:"Error"})
// }

// }

// //fetch user cart data

// const getCart =async (req,res) =>{
// try {
//     let userData  = await userModel.findById(req.body.userId)
//     let cartData = await userData.cartData;
//     res.json({success:true,cartData})
// } catch (error) {
//     console.log(error);
//     res.json({success:false,message:"Error"})
// }
// }



// export {addToCart,removeFromCart,getCart}

import userModel from '../models/userModel.js';

// 🛒 Add item to user cart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    // 1️⃣ Validate request
    if (!userId || !itemId) {
      return res.status(400).json({ success: false, message: "userId or itemId missing" });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};

    // 2️⃣ Update cart
    if (!cartData[itemId]) {
      cartData[itemId] = 1;
    } else {
      cartData[itemId] += 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    return res.status(200).json({ success: true, message: "Added to cart" });

  } catch (error) {
    console.error("AddToCart Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 🧹 Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;
    if (!userId || !itemId) {
      return res.status(400).json({ success: false, message: "userId or itemId missing" });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};

    if (cartData[itemId] > 0) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) delete cartData[itemId];
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.status(200).json({ success: true, message: "Removed from cart" });
  } catch (error) {
    console.error("RemoveFromCart Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 📦 Get user cart
const getCart = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, message: "userId missing" });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const cartData = userData.cartData || {};
    res.status(200).json({ success: true, cartData });
  } catch (error) {
    console.error("GetCart Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export { addToCart, removeFromCart, getCart };
