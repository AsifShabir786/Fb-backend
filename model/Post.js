const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    content:{type:String},
    mediaUrl:{type:String},
    groupName:{type:String},
    pages:{type:String},
    isFeatured:{type:String},



    mediaType:{type:String, enum:['image','video']},
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', default: null },
    

    likes:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
    comments:[
        {
            user:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
            text:{type:String,required:true},
            createdAt:{type:Date, default:Date.now()},

        }
    ],
    likeCount:{type:Number,default:0},
    commentCount:{type:Number,default:0},
    share:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
    shareCount:{type:Number,default:0}

},{timestamps:true})


const Post = mongoose.model('Post',postSchema)
module.exports = Post;