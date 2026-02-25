import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const frontend_url = "http://localhost:3000";

// Place order
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

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

        // Clear user's cart
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        // Create Stripe session
        const line_items = items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100 * 80 // Convert to paise
            },
            quantity: item.quantity
        }));

        // Add delivery charges
        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: 2 * 100 * 80
            },
            quantity: 1
        });

        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
            metadata: {
                orderId: newOrder._id.toString()
            }
        });

        // Update order with session ID
        newOrder.stripeSessionId = session.id;
        await newOrder.save();

        res.json({
            success: true,
            session_url: session.url,
            orderId: newOrder._id
        });

    } catch (error) {
        console.error("Place order error:", error);
        res.status(500).json({
            success: false,
            message: "Error placing order"
        });
    }
};

// Verify payment
// const verifyOrder = async (req, res) => {
//     try {
//         const { orderId, success } = req.body;

//         if (!orderId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Order ID required"
//             });
//         }

//         if (success === "true") {
//             const order = await orderModel.findByIdAndUpdate(
//                 orderId,
//                 {
//                     paymentStatus: 'paid',
//                     status: 'Food Processing'
//                 },
//                 { new: true }
//             );

//             res.json({
//                 success: true,
//                 message: 'Payment successful',
//                 order
//             });
//         } else {
//             // Delete failed order
//             await orderModel.findByIdAndDelete(orderId);
            
//             res.json({
//                 success: false,
//                 message: "Payment failed"
//             });
//         }
//     } catch (error) {
//         console.error("Verify order error:", error);
//         res.status(500).json({
//             success: false,
//             message: "Error verifying order"
//         });
//     }
// };


// Verify payment
const verifyOrder = async (req, res) => {
    try {
        const { orderId, success } = req.body;

        console.log("🔍 Verifying order:", orderId, "Success:", success);

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

            console.log("✅ Order updated:", order);

            res.json({
                success: true,
                message: 'Payment successful',
                order
            });
        } else {
            // Delete failed order
            await orderModel.findByIdAndDelete(orderId);
            console.log("❌ Order deleted - payment failed");
            
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
// Get user orders
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

// Admin: Get all orders
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

// Update order status
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

// Get order statistics (for dashboard)
const getOrderStats = async (req, res) => {
    try {
        const totalOrders = await orderModel.countDocuments();
        const totalRevenue = await orderModel.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        
        const pendingOrders = await orderModel.countDocuments({
            status: 'Food Processing'
        });

        const deliveredOrders = await orderModel.countDocuments({
            status: 'Delivered'
        });

        res.json({
            success: true,
            data: {
                totalOrders,
                totalRevenue: totalRevenue[0]?.total || 0,
                pendingOrders,
                deliveredOrders
            }
        });
    } catch (error) {
        console.error("Order stats error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching stats"
        });
    }
};

export {
    placeOrder,
    verifyOrder,
    userOrders,
    listOrders,
    updateStatus,
    getOrderStats
};













