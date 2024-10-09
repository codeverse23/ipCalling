const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            // Check if user has a role
            if (!req?.user?.role) {
                return res.json({
                    status: false,
                    statusCode: 400,
                    message: "Unauthorized Access - No Role Found"
                });
            }

            // Check if user's role is in the allowedRoles array
            const userRole = req.user.role;
            if (!allowedRoles.includes(userRole)) {
                return res.json({
                    status: false,
                    statusCode: 403,  // Forbidden
                    message: "Unauthorized Access - Role Not Allowed"
                });
            }

            next(); // User is authorized, move to the next middleware/controller
        } catch (error) {
            return res.json({
                status: false,
                statusCode: 500,
                message: "Unauthorized Access - Server Error"
            });
        }
    };
};

module.exports = verifyRoles;
