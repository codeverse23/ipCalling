import express from 'express';
import {versionOneRouter} from './v1/index'

const mainRouter = express.Router();

// for first time adding admin info and default system logo,favIcon And background image

// import './seeders/adminSeeders.js'
console.log("1")
mainRouter.use("/v1",versionOneRouter);

export { mainRouter };