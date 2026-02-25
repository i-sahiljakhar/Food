

// import jwt from "jsonwebtoken";

// const authMiddleware = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({
//       success: false,
//       message: "Not Authorized, Login Again",
//     });
//   }

//   try {
//     const token = authHeader.split(" ")[1];

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     req.body.userId = decoded.id;
//     next();
//   } catch (error) {
//     console.log(error);
//     return res.status(401).json({
//       success: false,
//       message: "Invalid Token",
//     });
//   }
// };

// export default authMiddleware;










// import jwt from "jsonwebtoken";

// const authMiddleware = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({
//       success: false,
//       message: "Not Authorized, Login Again",
//     });
//   }

//   try {
//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
//     // Add userId to request body
//     req.body.userId = decoded.id;
    
//     next();
//   } catch (error) {
//     console.log(error);
//     return res.status(401).json({
//       success: false,
//       message: "Invalid Token",
//     });
//   }
// };

// export default authMiddleware;

  





// import jwt from "jsonwebtoken";

// const authMiddleware = (req, res, next) => {
//     try {
//         const authHeader = req.headers.authorization;

//         if (!authHeader || !authHeader.startsWith("Bearer ")) {
//             return res.status(401).json({
//                 success: false,
//                 message: "No token provided"
//             });
//         }

//         const token = authHeader.split(" ")[1];
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         // Add user info to request
//         req.userId = decoded.id;
//         req.userRole = decoded.role || 'user';

//         next();
//     } catch (error) {
//         console.error("Auth error:", error);
        
//         if (error.name === 'TokenExpiredError') {
//             return res.status(401).json({
//                 success: false,
//                 message: "Token expired"
//             });
//         }

//         return res.status(401).json({
//             success: false,
//             message: "Invalid token"
//         });
//     }
// };

// // Admin middleware
// const adminMiddleware = (req, res, next) => {
//     if (req.userRole !== 'admin') {
//         return res.status(403).json({
//             success: false,
//             message: "Access denied. Admin only."
//         });
//     }
//     next();
// };

// export default authMiddleware;
// export { adminMiddleware };



import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        console.log("Auth Header received:", authHeader); // Debug ke liye

        // Check if auth header exists
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "No authorization header provided"
            });
        }

        // Check if it starts with Bearer
        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format. Use Bearer token"
            });
        }

        // Extract token
        const token = authHeader.split(" ")[1];
        
        if (!token || token === 'null' || token === 'undefined') {
            return res.status(401).json({
                success: false,
                message: "Token is missing or invalid"
            });
        }

        console.log("Token extracted:", token.substring(0, 20) + "..."); // Debug

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        console.log("Decoded token:", decoded); // Debug

        // Add user info to request
        req.body.userId = decoded.id || decoded.userId;
        req.userId = decoded.id || decoded.userId;
        req.userRole = decoded.role || 'user';

        next();

    } catch (error) {
        console.error("Auth middleware error:", error.name, error.message);

        // Handle specific JWT errors
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Token expired. Please login again.",
                code: "TOKEN_EXPIRED"
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: "Invalid token. Please login again.",
                code: "INVALID_TOKEN"
            });
        }

        if (error.name === 'NotBeforeError') {
            return res.status(401).json({
                success: false,
                message: "Token not active yet.",
                code: "TOKEN_NOT_ACTIVE"
            });
        }

        // Generic error
        return res.status(401).json({
            success: false,
            message: "Authentication failed",
            error: error.message
        });
    }
};

export default authMiddleware;





