import jwt from "jsonwebtoken"

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role // Include the role in the token
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: '30d'
    }
  );
};

module.exports = generateToken; 