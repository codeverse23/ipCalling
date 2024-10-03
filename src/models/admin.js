import  mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        email: {
			type: String,
		},
        mobile: {
            type: Number,
        },
        password: {
			type: String,
		},
        permission: {
            type: Object,
            default:{}
        },
        knowPassword:{
            type:String
        },
        role: {
            type: String,
        },
        isBlock: {
            type: Boolean,
            default:false
        },
        loginStatus: {
            type: String,
        }
    },
    {
        timestamps:true
    }
);

export default mongoose.model("Admin", adminSchema);
