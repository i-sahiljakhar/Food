// import express from 'express'
// import { addToCart,removeFromCart,getCart } from '../controllers/cartController.js'
// import authMiddleware from '../middleware/auth.js';

// const cartRouter = express.Router();

// cartRouter.post('/add',authMiddleware,addToCart)
// cartRouter.post('/remove',authMiddleware,removeFromCart)
// cartRouter.post('/get',authMiddleware,getCart)

// export default cartRouter;

import express from 'express';
import { addToCart, removeFromCart, getCart } from '../controllers/cartController.js';
import authMiddleware from '../middleware/auth.js';
import { debugAuth } from '../middleware/debugAuth.js'; // ✅ Import karo

const cartRouter = express.Router();

// ✅ Debug auth lagao har route mein
cartRouter.post('/add', debugAuth, authMiddleware, addToCart);
cartRouter.post('/remove', debugAuth, authMiddleware, removeFromCart);
cartRouter.post('/get', debugAuth, authMiddleware, getCart);

export default cartRouter;