const jwt = require("jsonwebtoken");
const user = require("../model/user");
module.exports.varifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, "tytyty", async (err, decodedUser) => {
            if (err) {
                return res.json({
                    status: true,
                    statusCode: 400,
                    message: "Token is not valid"
                });
            }

            req.user = decodedUser;

            // Update the lastActive time and ensure the user is marked as active
            const userEmail = decodedUser.email;
            await user.findOneAndUpdate(
              { email: userEmail }, 
              { 
                lastActive: new Date(), // Update to current time
                status: 'active' // Keep marking them as active
              }
            );

            next();
        });
    } else {
        return res.json({
            status: true,
            statusCode: 400,
            message: "Authorization token not provided"
        });
    }
};