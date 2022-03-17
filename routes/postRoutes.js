const router = require('express').Router()

const { isAuthenticated } = require('../middlewares/auth')

const {
    newPost,
    allPosts,
    singlePost,
    postsByCategory,
    deletePost,
    updatePost,
} = require('../controllers/postControllers')


router.route('/new').post(isAuthenticated, newPost);

router.route('/').get(allPosts)
router.route('/:category').get(postsByCategory)

router.route('/post/:postId').get(singlePost)
router.route('/post/edit/:postId').patch(isAuthenticated, updatePost);
router.route('/post/delete/:postId').delete(isAuthenticated, deletePost);


module.exports = router