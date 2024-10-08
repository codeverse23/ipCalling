const roleList = require("../src/consts/autho.js");

const verifyRoles = (...allowedRoles) => { 
    return (req, res, next) => {
        try {
            console.log("2")
            console.log(role,"req.roles")
            if (!req?.role) {
                return res.json({
                    status: false,
                    statusCode: 400,
                    message: "Unauthorized Access"
                });
            }

            const rolesArray = [...allowedRoles];
            const isAdmin = allowedRoles.includes(roleList.ADMIN);
            let result = req.roles.some(role => rolesArray.includes(role)) || isAdmin;

            if (!result) {
                return res.json({
                    status: false,
                    statusCode: 400,
                    message: "Unauthorized Access"
                });
            }

            next();
        } catch (error) {
            return res.json({
                status: false,
                statusCode: 400,
                message: "Unauthorized Access"
            });
        }
    };
};

module.exports = verifyRoles;
