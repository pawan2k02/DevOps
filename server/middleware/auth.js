import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(403).json({ message: "Login required! No token found." });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "apni_secret_key"
    );
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token!" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); 
  } else {
    return res.status(403).json({
      message: "Access Denied! Only Admin can perform this action.",
    });
  }
};
