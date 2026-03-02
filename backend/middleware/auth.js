import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        console.log("🔍 Auth Header received:", authHeader ? "✅ Present" : "❌ Missing");

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "No authorization header provided"
            });
        }

        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format. Use Bearer token"
            });
        }

        const token = authHeader.split(" ")[1];
        
        if (!token || token === 'null' || token === 'undefined') {
            return res.status(401).json({
                success: false,
                message: "Token is missing or invalid"
            });
        }

        console.log("🔍 Token received:", token.substring(0, 30) + "...");
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        console.log("🔍 Decoded token:", decoded);

        // Set userId in request
        req.body.userId = decoded.id || decoded.userId;
        req.userId = decoded.id || decoded.userId;
        req.userRole = decoded.role || 'user';

        next();

    } catch (error) {
        console.error("❌ Auth middleware error:", error.name, error.message);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Token expired. Please login again."
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: "Invalid token. Please login again."
            });
        }

        return res.status(401).json({
            success: false,
            message: "Authentication failed"
        });
    }
};

export default authMiddleware;