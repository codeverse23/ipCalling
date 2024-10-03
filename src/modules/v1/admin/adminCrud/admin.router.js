import express from "express";
const adminDetailsRouters = express.Router();

adminDetailsRouters.post(
    "/adminLogin",
    // varifyToken,
    // validator(loginSchema),
    adminLogin
);

export {adminDetailsRouters}
