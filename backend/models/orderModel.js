import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    items: [{
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
        name: String,
        price: Number,
        quantity: Number,
        image: String,
        category: String
    }],
    amount: {
        type: Number,
        required: true
    },
    address: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipcode: { type: String, required: true },
        country: { type: String, required: true },
        phone: { type: String, required: true }
    },
    status: {
        type: String,
        default: 'Food Processing'
    },
    paymentStatus: {
        type: String,
        default: 'pending'
    },
    stripeSessionId: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;