import jwt from "jsonwebtoken";

const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        console.log("🔵 Backend: Admin login attempt:", email);

        if (email === "Sahiljakhar015@gmail.com" && password === "Jakhar@123") {
            const token = jwt.sign(
                { 
                    id: "admin",
                    role: "admin",
                    email: email 
                }, 
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            console.log("🔵 Backend: Token created, length:", token.length);
            console.log("🔵 Backend: Is JWT?", token.split('.').length === 3);

            return res.json({
                success: true,
                token: token,
                message: "Admin login successful"
            });
        } else {
            console.log("🔴 Backend: Invalid credentials");
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }
    } catch (error) {
        console.error("🔴 Backend error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export { adminLogin };