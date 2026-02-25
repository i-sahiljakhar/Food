


import userModel from '../models/userModel.js';

const addToCart = async (req, res) => {
  try {
    const { itemId, userId } = req.body; 

    if (!userId || !itemId) {
      return res.status(400).json({ 
        success: false, 
        message: "userId or itemId missing" 
      });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    let cartData = userData.cartData || {};

    cartData[itemId] = (cartData[itemId] || 0) + 1;

    await userModel.findByIdAndUpdate(userId, { cartData });
    
    res.status(200).json({ 
      success: true, 
      message: "Added to cart" 
    });

  } catch (error) {
    console.error("AddToCart Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server Error" 
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { itemId, userId } = req.body;

    if (!userId || !itemId) {
      return res.status(400).json({ 
        success: false, 
        message: "userId or itemId missing" 
      });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    let cartData = userData.cartData || {};

    if (cartData[itemId] > 0) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    
    res.status(200).json({ 
      success: true, 
      message: "Removed from cart" 
    });

  } catch (error) {
    console.error("RemoveFromCart Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server Error" 
    });
  }
};

const getCart = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: "userId missing" 
      });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    const cartData = userData.cartData || {};
    
    res.status(200).json({ 
      success: true, 
      cartData 
    });

  } catch (error) {
    console.error("GetCart Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server Error" 
    });
  }
};

export { addToCart, removeFromCart, getCart };