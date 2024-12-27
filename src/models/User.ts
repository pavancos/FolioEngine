import { Schema, model, Types } from "mongoose";

const UserSchema=new Schema({
    username:{type:String,required:true,unique:true},
    avatar:{type:String, required:true, default:'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'},
    recentConfig:{type:Object , default:{} },
    likes:[{type:Types.ObjectId,ref:'Folio'}],
    craftBenches:[{type:Types.ObjectId,ref:'CraftBench'}],
    createdOn:{type:Date,default:Date.now},
    lastLogin:{type:Date,default:Date.now},
    lastCreation:{type:Date,default:Date.now},
})

export default model('User',UserSchema)