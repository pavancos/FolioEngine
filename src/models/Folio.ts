import { Schema, model, Types } from "mongoose";

const creatorType = {
    developedBy: [{ 
        name: { type: String, required: true },
        githubUsername: { type: String, required: true },
    }]
}

const FolioSchema = new Schema({
    folioName: { type: String, required: true, unique: true },
    folioAvatar: { type: String, required: true },
    creator: { type: creatorType, required: true },
    previewLink: { type: String, required: true },
    previewImageLink: { type: String, required: true },
    likedBy: [{ type: String }],
})

export default model('Folio', FolioSchema)
