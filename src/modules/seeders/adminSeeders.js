import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { MONGO_DB_URI } from '../config/env.config.js';
import admin from '../models/admin.js';

async function seedAdmin() {
    try {
        await mongoose.connect(MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Database connection successful!");

        const existingAdmin = await admin.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log("Already 1 admin exists");
            return;
        }

        // Define admin credentials
        const adminCredentials = {
            name: "super admin",
            email: "superadmin@example.com",
            mobile: "1234567890",
            username: "superadmin",
            password: "superAdmin123",
            knowPassword: "superAdmin123",
            role: "ADMIN",
            isBlock: false,
            loginStatus: "active",
            last_login: new Date().toISOString(),
            col_view_permission: {}
        };
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(adminCredentials.password, saltRounds);
        adminCredentials.password = hashedPassword;

        const newAdmin = new admin(adminCredentials);
        const savedAdmin = await newAdmin.save();
        console.log("Admin created successfully");
        // //add the system info
        // const logoUrl = "https://ramabetsfile.s3.eu-north-1.amazonaws.com/uploads/systemInfo/logo_1720082431678_logo%20%282%29.png";
        // const favIconUrl = "https://ramabetsfile.s3.eu-north-1.amazonaws.com/uploads/systemInfo/favIcon_1720082431704_logo%20%282%29.png";
        // const backgroundImageUrl = "https://ramabetsfile.s3.eu-north-1.amazonaws.com/uploads/systemInfo/backgroundImage_1720072533961_test.jpeg";

        // Define system info
        // const systemInfo = {
        //     adminId: savedAdmin._id.toString(),
        //     title: "System Title",
        //     logo: logoUrl,
        //     favIcon: favIconUrl,
        //     backgroundImage: backgroundImageUrl
        // };

        // const newSystemInfo = new System(systemInfo);
        // await newSystemInfo.save();
        // console.log("System info created successfully");

    } catch (error) {
        console.error("Error seeding admin:", error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

seedAdmin();