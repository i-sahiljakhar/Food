


import foodModel from "../models/foodModel.js";
import fs from "fs";

// Add food item
const addFood = async (req, res) => {
    try {
        const { name, description, price, category } = req.body;
        
        // Validation
        if (!name || !description || !price || !category || !req.file) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const image_filename = req.file.filename;

        const food = new foodModel({
            name,
            description,
            price: Number(price),
            category,
            image: image_filename
        });

        await food.save();
        res.status(201).json({
            success: true,
            message: "Food added successfully",
            data: food
        });
    } catch (error) {
        console.error("Add food error:", error);
        res.status(500).json({
            success: false,
            message: "Error adding food"
        });
    }
};

// Get all food items
const listFood = async (req, res) => {
    try {
        const { category, search, page = 1, limit = 10 } = req.query;
        let query = {};

        if (category && category !== 'All') {
            query.category = category;
        }

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const skip = (page - 1) * limit;
        
        const foods = await foodModel.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await foodModel.countDocuments(query);

        res.json({
            success: true,
            data: foods,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("List food error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching foods"
        });
    }
};

// Remove food item
const removeFood = async (req, res) => {
    try {
        const { id } = req.body;

        const food = await foodModel.findById(id);
        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Food not found"
            });
        }

        // Delete image file
        fs.unlink(`uploads/${food.image}`, (err) => {
            if (err) console.error("Error deleting image:", err);
        });

        await foodModel.findByIdAndDelete(id);

        res.json({
            success: true,
            message: "Food removed successfully"
        });
    } catch (error) {
        console.error("Remove food error:", error);
        res.status(500).json({
            success: false,
            message: "Error removing food"
        });
    }
};

// Update food item
const updateFood = async (req, res) => {
    try {
        const { id, name, description, price, category } = req.body;
        
        const updateData = {
            name,
            description,
            price: Number(price),
            category
        };

        if (req.file) {
            // Delete old image
            const oldFood = await foodModel.findById(id);
            if (oldFood && oldFood.image) {
                fs.unlink(`uploads/${oldFood.image}`, (err) => {
                    if (err) console.error("Error deleting old image:", err);
                });
            }
            updateData.image = req.file.filename;
        }

        const food = await foodModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Food not found"
            });
        }

        res.json({
            success: true,
            message: "Food updated successfully",
            data: food
        });
    } catch (error) {
        console.error("Update food error:", error);
        res.status(500).json({
            success: false,
            message: "Error updating food"
        });
    }
};

export { addFood, listFood, removeFood, updateFood };












