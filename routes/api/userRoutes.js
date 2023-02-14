const router = require('express').Router();
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    addThought,
    removeThought,
} = require('../../controllers/userController');

// /api/users
router.route('/').get(getAllUsers).post(createUser);

// /api/users/:userId

router.route('/:userId').get(getUserById).put(updateUser).delete(deleteUser);

// /api/users/:userId/thoughts
router.route('/:userId/thoughts').post(addThought);

// /api/users/:userId/thoughts/:thoughtId
router.route('/:userId/thoughts/:thoughtId').delete(removeThought);

module.exports = router;