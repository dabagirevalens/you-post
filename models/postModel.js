const { Schema, model } = require('mongoose');

const postSchema = new Schema({
    postBody :{
        type: String,
        required : [true, "Please add post body."]
    },

    authName : {
        type: String,
        required : true
    },

    category:{
        type: String,
        required : [true, "Please add the post category"],
        trim : true,
        lowercase: true,
        enum : [
            'sports',
            'politics',
            'entertainment',
        ]
    },

}, { timestamps: true})

module.exports = model("Post", postSchema);