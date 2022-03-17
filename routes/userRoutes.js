const router = require('express').Router()

const { isAuthenticated } = require('../middlewares/auth')

const {
    register,
    login,
    getUser,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    deleteProfile
} = require('../controllers/userController')


router.route('/register').post(register)
router.route('/login').post(login)

router.route('/me')
    .get(isAuthenticated, getUser)
    .patch(isAuthenticated, updateProfile)
    
router.route('/me/delete').delete(isAuthenticated, deleteProfile)

router.route('/password/change').put(isAuthenticated, changePassword)
router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:code').put(resetPassword)

module.exports = router