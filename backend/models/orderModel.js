// import mongoose from 'mongoose'

// const orderSchema = new mongoose.Schema({
//     userId:{type:String,required:true},
//     items:{type:Array,required:true},
//     amount:{type:Number,required:true},
//     address:{type:Object,required:true},
//     status:{type:String,default:"Food Processing"},
//     data:{type:Date,default:Date.now()},
//     payment:{type:Boolean,default:false}

// })

// const orderModel = mongoose.models.order || mongoose.model("order",orderSchema);
// export default orderModel;






import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        index: true
    },
    items: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Food'
        },
        name: String,
        price: Number,
        quantity: Number,
        image: String,
        category: String
    }],
    amount: {
        type: Number,
        required: true,
        min: 0
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
        enum: ['Food Processing', 'Out for Delivery', 'Delivered', 'Cancelled'],
        default: 'Food Processing'
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'cash'],
        default: 'card'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    paymentId: String,
    stripeSessionId: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    deliveredAt: Date
});

// Index for faster queries
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;