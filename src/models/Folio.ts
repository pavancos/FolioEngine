import { Schema, model, Types } from "mongoose";

const creatorType = {
    developedBy: [{ type: String }],
    createdBy: [{ type: String }],
}

const FolioSchema = new Schema({
    folioName: { type: String, required: true, unique: true },
    folioAvatar: { type: String, required: true },
    creator: { type: creatorType, required: true },
    previewLink: { type: String, required: true },
    likedBy: [{ type: String }],
})

export default model('Folio', FolioSchema)