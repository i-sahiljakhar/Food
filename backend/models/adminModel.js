import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['superadmin', 'manager', 'staff'],
        default: 'staff'
    },
    permissions: [{
        type: String,
        enum: ['add_food', 'edit_food', 'delete_food', 'view_orders', 'update_orders']
    }],
    lastLogin: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const adminModel = mongoose.models.admin || mongoose.model("admin", adminSchema);
export default adminModel;