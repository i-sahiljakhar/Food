import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import Stripe from 'stripe';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

// Debug - check if key loaded
// console.log("🔑 STRIPE_KEY at init:", process.env.STRIPE_SECRET_KEY ? "✅ FOUND" : "❌ MISSING");
// console.log("🔑 KEY LENGTH:", process.env.STRIPE_SECRET_KEY?.length || 0);









const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const frontend_url = process.env.FRONTEND_URL || "http://localhost:3000";

// ✅ Place Order with Stripe Payment
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        console.log("📦 Order Data:", { userId, amount });

        // Validation
        if (!userId || !items || !amount || !address) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // Create order
        const newOrder = new orderModel({
            userId,
            items,
            amount,
            address,
            paymentStatus: 'pending'
        });

        await newOrder.save();
        console.log("✅ Order saved:", newOrder._id);

        // Clear cart
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        // Create line items
        const line_items = items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: { name: item.name },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity
        }));

        line_items.push({
            price_data: {
                currency: "inr",
                product_data: { name: "Delivery Charges" },
                unit_amount: 40 * 100,
            },
            quantity: 1
        });

        console.log("🔄 Creating Stripe session...");

        // ✅ Check if stripe is initialized
        if (!stripe) {
            throw new Error("Stripe not initialized");
        }

        // Create session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
            metadata: {
                orderId: newOrder._id.toString()
            }
        });

        console.log("✅ Stripe session created:", session.id);

        newOrder.stripeSessionId = session.id;
        await newOrder.save();

        res.json({
            success: true,
            session_url: session.url,
            orderId: newOrder._id
        });

    } catch (error) {
        console.error("❌ Place order error:", error);
        
        // Special handling for auth errors
        if (error.type === 'StripeAuthenticationError') {
            console.log("🔄 Attempting emergency direct initialization...");
            
            try {
                // Last resort - hardcoded key
                const emergencyStripe = new (require('stripe'))('sk_test_51PJqfcSIF9U0b4S5YmnSgV3PCFOgdrBMaVpGD9qYebwvsjXYMa8HHB9zo3ouBLvTTAqJARbdRjaOoGKtFc7HPaHM00fHAGLg9Q');
                
                const emergencySession = await emergencyStripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    line_items: items.map(item => ({
                        price_data: {
                            currency: "inr",
                            product_data: { name: item.name },
                            unit_amount: Math.round(item.price * 100),
                        },
                        quantity: item.quantity
                    })),
                    mode: 'payment',
                    success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
                    cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
                });
                
                console.log("✅ Emergency fix worked!");
                return res.json({
                    success: true,
                    session_url: emergencySession.url,
                    orderId: newOrder._id
                });
            } catch (emergencyError) {
                console.error("❌ Emergency fix failed:", emergencyError.message);
            }
        }
        
        res.status(500).json({
            success: false,
            message: error.message || "Error placing order"
        });
    }
};

// ✅ Verify Payment
const verifyOrder = async (req, res) => {
    try {
        const { orderId, success } = req.body;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID required"
            });
        }

        if (success === "true") {
            const order = await orderModel.findByIdAndUpdate(
                orderId,
                {
                    paymentStatus: 'paid',
                    status: 'Food Processing'
                },
                { new: true }
            );

            res.json({
                success: true,
                message: 'Payment successful',
                order
            });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({
                success: false,
                message: "Payment failed"
            });
        }
    } catch (error) {
        console.error("❌ Verify order error:", error);
        res.status(500).json({
            success: false,
            message: "Error verifying order"
        });
    }
};
// ✅ Get user orders
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const { page = 1, limit = 10 } = req.query;

        const skip = (page - 1) * limit;

        const orders = await orderModel.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await orderModel.countDocuments({ userId });

        res.json({
            success: true,
            data: orders,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("User orders error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching orders"
        });
    }
};

// ✅ Admin: Get all orders
const listOrders = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        let query = {};

        if (status && status !== 'All') {
            query.status = status;
        }

        const skip = (page - 1) * limit;

        const orders = await orderModel.find(query)
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await orderModel.countDocuments(query);

        res.json({
            success: true,
            data: orders,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("List orders error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching orders"
        });
    }
};

// ✅ Update order status
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        const updateData = { status };
        
        if (status === 'Delivered') {
            updateData.deliveredAt = Date.now();
        }

        const order = await orderModel.findByIdAndUpdate(
            orderId,
            updateData,
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.json({
            success: true,
            message: "Status updated",
            data: order
        });
    } catch (error) {
        console.error("Update status error:", error);
        res.status(500).json({
            success: false,
            message: "Error updating status"
        });
    }
};

export {
    placeOrder,
    verifyOrder,
    userOrders,
    listOrders,
    updateStatus
};


