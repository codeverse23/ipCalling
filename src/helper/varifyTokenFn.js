const jwt = require("jsonwebtoken");
module.exports.varifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, "tytyty", (err, user) => {
            if (err) {
                return res.json({
                    status: true,
                    statusCode: 400,
                    message: "Token is not valid"
                })
            }
            req.user = user;
            next();
        })
    } else {
        return res.json({
            status: true,
            statusCode: 400,
            message: "Authorization token not provided"
        })
    }
};