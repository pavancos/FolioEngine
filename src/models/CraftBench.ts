import { Schema, model, Types } from "mongoose";

const CraftBenchSchema = new Schema({
    craftBenchName: { type: String, required: true},
    craftBenchAvatar: { type: String, required: true},
    repoName: { type: String, required: true},
    currentConfig:{type:Object},
    lastUpdated:{type:Date,default:Date.now},
    status:{type:String,enum:['published', 'inProgress'],default:"inProgress"},
    userCreated: { type: Types.ObjectId, ref: "User" },
    folioSelected: { type: Types.ObjectId, ref: "Folio" },
})

export default model('CraftBench',CraftBenchSchema)