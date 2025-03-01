import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access Denied: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded; 
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token" });
    }
};

export default authMiddleware;
