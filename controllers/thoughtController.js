// TODO: fill this in
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

module.exports = {
  // get all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .then(async (thoughts) => {
        const thoughtObj = {
          thoughts,
          thoughtCount: await thoughtCount(),
        };
        res.json(thoughtObj);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  // get one thought by id
  getThoughtById(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select("-__v")
      .then(async (thought) =>
        !thought
          ? res.status(404).json({ message: "No thought found with this id!" })
          : res.json({
              thought,
              friendCount: await friendCount(req.params.thoughtId),
              thoughtCount: await thoughtCount(req.params.thoughtId),
            })
      )
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  // create thought
  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => res.json(thought))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  // update thought by id
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought found with this id!" })
          : res.json(thought)
      )
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  // delete thought by id
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought found with this id!" })
          : res.json(thought)
      )
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // get all reactions
  getAllReactions(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select("-__v")
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought found with this id!" })
          : res.json(thought.reactions)
      )
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  // get one reaction by id
  getReactionById(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select("-__v")
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought found with this id!" })
          : res.json(thought.reactions.id(req.params.reactionId))
      )
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // create reaction
  createReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $push: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought found with this id!" })
          : res.json(thought)
      )
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  // delete reaction
  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought found with this id!" })
          : res.json(thought)
      )
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
};
