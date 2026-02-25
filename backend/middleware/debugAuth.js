export const debugAuth = (req, res, next) => {
    console.log("\n🔍 === DEBUG AUTH ===");
    console.log("📨 URL:", req.url);
    console.log("📨 Headers:", {
        authorization: req.headers.authorization ? "✅ Present" : "❌ Missing"
    });
    
    if (req.headers.authorization) {
        const parts = req.headers.authorization.split(' ');
        console.log("🔑 Parts:", parts.length);
        console.log("🔑 Type:", parts[0]);
        
        if (parts.length > 1) {
            const token = parts[1];
            console.log("🔑 Token length:", token.length);
            console.log("🔑 Token preview:", token.substring(0, 20) + "...");
            
            // Check if JWT format
            const jwtParts = token.split('.');
            console.log("🔑 JWT parts:", jwtParts.length);
            console.log("🔑 Is valid JWT?", jwtParts.length === 3 ? "✅ YES" : "❌ NO");
            
            if (jwtParts.length === 3) {
                try {
                    // Decode without verification just to see
                    const decoded = JSON.parse(atob(jwtParts[1]));
                    console.log("🔑 Payload:", decoded);
                } catch (e) {
                    console.log("🔑 Could not decode payload");
                }
            }
        }
    }
    console.log("🔍 === END DEBUG ===\n");
    next();
};