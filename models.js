import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

let models = {}

console.log("connecting to mongodb")

await mongoose.connect(process.env.MONGODB_URI)

console.log("successfully connected to mongodb!")

const postSchema = new mongoose.Schema({
    url: String,
    description: String,
    username: String,
    likes: [String],
    created_date: Date
})

models.Post = mongoose.model('Post', postSchema)

const commentSchema = new mongoose.Schema({
    username: String,
    comment: String,
    post: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
    created_date: Date
})

models.Comment = mongoose.model('Comment', commentSchema)

const userInfoSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    favoriteWebsite: String,
    bio: String,
    created_date: { type: Date, default: Date.now }
})

models.UserInfo = mongoose.model('UserInfo', userInfoSchema)

console.log("mongoose models created")

export default models