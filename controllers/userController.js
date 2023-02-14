const { ObjectId } = require("mongoose").Types;
const { Thought, User } = require("../models");

//Aggregate function to get the number of users overall
const userCount = async () =>
  User.aggregate()
    .count("userCount")
    .then((numberofUsers) => numberofUsers);

const thoughtCount = async () =>
  Thought.aggregate()
    .count("thoughtCount")
    .then((numberofThoughts) => numberofThoughts);

const friendCount = async () =>
  User.aggregate()
    .unwind("friends")
    .group({ _id: null, friendCount: { $sum: 1 } })
    .then((numberofFriends) => numberofFriends);
// TODO: finish this
module.exports = {
  getAllUsers(req, res) {
    User.find({})
      .then(async (users) => {
        const userObj = {
          users,
          userCount: await userCount(),
        };
        res.json(userObj);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  getUserById(req, res) {
    User.findOne({ _id: params.userId })
      .select("-__v")
      .then(async (user) =>
        !user
          ? res.status(404).json({ message: "No user found with this id!" })
          : res.json({
              user,
              friendCount: await friendCount(req.params.userId),
              thoughtCount: await thoughtCount(req.params.userId),
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
      .catch((err) => res.status(400).json(err));
  },
  deleteUser(req, res) {
    User.findOneAndRemove({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user found with this id!" })
          : res.json(user)
      )
      .catch((err) => res.status(400).json(err));
  },
  updateUser(req, res) {
    User.findOneAndUpdate({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user found with this id!" })
          : res.json(user)
      )
      .catch((err) => res.status(400).json(err));
  },
  addThought(req, res) {
    console.log("You are adding a thought!");
    console.log(req.body);
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { thoughts: req.body } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user found with this id!" })
          : res.json(user)
      )
      .catch((err) => res.status(400).json(err));
  },
  removeThought(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { thoughts: { _id: req.params.thoughtId } } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user found with this id!" })
          : res.json(user)
      )
      .catch((err) => res.status(400).json(err));
  },
  createFriend(req, res) {
    console.log("You are adding a friend!");
    console.log(req.body);
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.body } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user found with this id!" })
          : res.json(user)
      )
      .catch((err) => res.status(400).json(err));
  },
  deleteFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: { _id: req.params.friendId } } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user found with this id!" })
          : res.json(user)
      )
      .catch((err) => res.status(400).json(err));
  },
};

// Path: controllers\thoughtController.js
