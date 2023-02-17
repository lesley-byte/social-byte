const router = require("express").Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  addThought,
  removeThought,
  getAllFriends,
  getFriendById,
  createFriend,
  deleteFriend,
} = require("../../controllers/userController");

// /api/users
router.route("/").get(getAllUsers).post(createUser);

// /api/users/:userId

router.route("/:userId").get(getUserById).put(updateUser).delete(deleteUser);

// /api/users/:userId/thoughts
router.route("/:userId/thoughts").post(addThought);

// /api/users/:userId/thoughts/:thoughtId
router.route("/:userId/thoughts/:thoughtId").delete(removeThought);

// /api/users/:userId/friends
router.route("/:userId/friends").get(getAllFriends).post(createFriend);

// /api/users/:userId/friends/:friendId
router
  .route("/:userId/friends/:friendId")
  .get(getFriendById)
  .delete(deleteFriend);

module.exports = router;
