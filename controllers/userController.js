const { ObjectId } = require("mongoose").Types;
const { Thought, User } = require("../models");

//Aggregate function to get the number of users overall
// const userCount = async () =>
//   User.aggregate()
//     .count("userCount")
//     .then((numberofUsers) => numberofUsers);

const thoughtCount = async () =>
  Thought.aggregate()
    .count("thoughtCount")
    .then((numberofThoughts) => numberofThoughts);

// const friendCount = async () =>
//   User.aggregate()
//     .unwind("friends")
//     .group({ _id: null, friendCount: { $sum: 1 } })
//     .then((numberofFriends) => numberofFriends)
//     .catch((err) => {
//       console.log(err);
//       res.status(400).json(err);
//     });
    
// TODO: finish this
module.exports = {
  getAllUsers(req, res) {
    User.find({})  // find all users
      .then(async (users) => {
        console.log(users);
        // for all users console.log the _id: new ObjectId and username
        users.forEach((user) => {
// use ObjectId to convert the _id to a string
          console.log(`_id: ${new ObjectId(user._id)}, username: ${user.username}`);
        });
        const userObj = {
          users,
        };
        res.json(userObj);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  getUserById(req, res) {
    User.findOne({ _id: req.params.userId })  // find one user by id
      .select("-__v")
      .then(async (user) =>
        !user
          ? res.status(404).json({"error" : err.name + ": " + err.message})
          : res.json({
              user,
              // friendCount: await friendCount(req.params.userId),
              // thoughtCount: await thoughtCount(req.params.userId),
            })
      )
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  deleteUser(req, res) {
    User.findOneAndRemove({ _id: req.params.userId }) // find one user by id and remove
      .then((user) =>
        !user
          ? res.status(404).json({"error" : err.name + ": " + err.message})
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() => res.json({ message: "User deleted!" }))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },  // find one user by id
      { $set: req.body }, // set the body of the request
      { runValidators: true, new: true }  // run validators and return the new user
    )
      .then((user) =>
        !user
          ? res.status(404).json({"error" : err.name + ": " + err.message})
          : res.json(user)
      )
      .catch((err) => {
        res.status(400).json({"error" : err.name + ": " + err.message});
        console.log(err);
      });
  },
  addThought(req, res) {
    console.log("You are adding a thought!");
    console.log(req.body);
    User.findOneAndUpdate(
      { _id: req.params.userId }, // find one user by id
      { $addToSet: { thoughts: req.body } },  // add the body of the request to the thoughts array
      { runValidators: true, new: true } // run validators and return the new user
    )
      .then((user) =>
        !user
          ? res.status(404).json({"error" : err.name + ": " + err.message})
          : res.json(user)
      )
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  removeThought(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId }, // find one user by id
      { $pull: { thoughts: { _id: req.params.thoughtId } } }, // pull the thought by id from the thoughts array
      { runValidators: true, new: true } // run validators and return the new user
    )
      .then((user) =>
        !user
          ? res.status(404).json({"error" : err.name + ": " + err.message})
          : res.json(user)
      )
      .catch((err) => {
        console.log(err);
        res.status(400).json({"error" : err.name + ": " + err.message});
      });
  },
  getAllFriends(req, res) {
    User.findOne({ _id: req.params.userId }) // find one user by id... is this the right way 🤨
      .select("-__v")
      .populate({
        path: "friends",
        select: "-__v",
      })
      // ? res.status(404).json({ message: "No user found with this id!" })
      // : Thought.deleteMany({ _id: { $in: user.thoughts } })
      .then((user) =>
        !user
          ? res.status(404).json({"error" : err.name + ": " + err.message})
          : res.json(user)
      )
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  getFriendById(req, res) {
    User.findOne({ _id: req.params.userId }) // find one user by id... is this the right way 🤨
      .select("-__v")
      .populate({
        path: "friends",
        select: "-__v",
        $match: { _id: req.params.friendId },
      })
      .then((user) =>
        !user
          ? res.status(404).json({"error" : err.name + ": " + err.message})
          : res.json(user)
      )
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  createFriend(req, res) {
    console.log("You are adding a friend!");
    console.log(req.body);
    User.findOneAndUpdate(
      { _id: req.params.userId }, // find one user by id
      { $addToSet: { friends: ObjectId(req.friends.params.id) } }, // add the body of the request to the friends array
      { runValidators: true, new: true } // run validators and return the new user
    )
      .then((user) =>
        !user
          ? res.status(404).json({"error" : err.name + ": " + err.message})
          : res.json(user)
      )
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  deleteFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId }, // find one user by id
      { $pull: { friends: { _id: req.params.friendId } } }, // this is not working 🤨
      { runValidators: true, new: true } // run validators and return the new user
    )
      .then((user) =>
        !user
          ? res.status(404).json({"error" : err.name + ": " + err.message})
          : res.json(user)
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json({"error" : err.name + ": " + err.message});
      });
  },
};

// Path: controllers\thoughtController.js
