const Post = require('../models/postModel');
const User = require('../models/userModel');


//function to get currently logged in user

const getUser = async (req) => {
    //get user from token
    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found."
        })
    }
    return user
}

//create new post
exports.newPost = async (req, res) => {
    try {

        const { postBody, category } = req.body

        //get user
        const user = await getUser(req)
        //user name
        const userName = user.userName;

        const post = await Post.create({
            postBody,
            category,
            authName: userName
        });


        if (!post) {
            return res.status(400).json({
                success: false,
                message: "Unable to create new post"
            })
        }

        //increase the number of user's posts
        user.numberOfPosts = user.numberOfPosts + 1;
        await user.save({ validateBeforeSave: false });

        return res.status(200).json({
            success: true,
            post
        })

    } catch (error) {

        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })

    }
}


//delete post
exports.deletePost = async (req, res) => {
    try {

        //Post id
        const postId = req.params.postId;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found!"
            })
        }

        //get user
        const user = await getUser(req)
        //user name
        const userName = user.userName;

        //delete the post if the user is the auth
        if (post.authName.trim().toLowerCase() === userName.trim().toLowerCase()) {
            //delete a post
            await post.remove();

            //decrease the number of user's posts
            user.numberOfPosts--;
            await user.save({ validateBeforeSave: false });

            return res.status(200).json({
                success: true,
                message: 'You have successfully deleted a post'
            })

        } else {
            return res.status(403).json({
                success: false,
                message: 'You are not allowed to delete other\'s posts.'
            })
        }

    } catch (error) {

        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })

    }
}


//get all posts
exports.allPosts = async (req, res) => {
    try {

        const posts = await Post.find({})
        if (!posts) {
            return res.status(404).json({
                success: false,
                message: "There is no posts!"
            })
        }

        console.log("posts...")

        return res.status(200).json({
            success: true,
            numberOfPosts: posts.length,
            posts
        })

    } catch (error) {

        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })

    }
}


//all posts by category
exports.postsByCategory = async (req, res) => {
    try {

        const category = req.params.category;

        const posts = await Post.find({ category: category });

        if (!posts) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }

        return res.status(200).json({
            success: true,
            messages: `all post in ${category} category.`,
            numberOfPosts: posts.length,
            posts
        })

    } catch (error) {

        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })

    }
}


//single post
exports.singlePost = async (req, res) => {
    try {

        //Post id
        const postId = req.params.postId;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found!"
            })
        }

        return res.status(200).json({
            success: true,
            post
        })

    } catch (error) {

        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })

    }
}


//update post
exports.updatePost = async (req, res) => {

    try {

        //update info
        const { postBody, category } = req.body;

        //Post id
        const postId = req.params.postId;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found!"
            })
        }

        //get user
        const user = await getUser(req)
        //user name
        const userName = user.userName;

        //check if current user is the auth of the post
        if (post.authName.trim().toLowerCase() !== userName.trim().toLowerCase()) {
            return res.status(403).json({
                success: false,
                message: 'You are not allowed to edit other\'s posts.'
            })

        } else {
            //if post body is provided update the post content
            if (postBody) {
                post.postBody = postBody
            }

            //if category then update post category
            if (category) {
                post.category = category
            }

            await post.save({ runValidators: true });

            return res.status(200).json({
                success: true,
                message: 'Post was updated',
                post
            })
        }

    } catch (error) {

        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })

    }

}
