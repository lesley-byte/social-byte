// TODO: fill this in
const { ObjectId } = require("mongoose").Types;
const { Thought, User } = require("../models");

//Aggregate function to get the number of thoughts

const thoughtCount = async () =>
  Thought.aggregate()
    .count("thoughtCount")
    .then((numberofThoughts) => numberofThoughts);

module.exports = {
  // get all thoughts
  getAllThoughts(req, res) {
    Thought.find({})  // find all thoughts
      .then(async (thoughts) => {
        const thoughtObj = {
          thoughts,
          thoughtCount: await thoughtCount(),
        };
        res.json(thoughtObj);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({"error" : err.name + ": " + err.message})
      });
  },
  // get one thought by id
  getThoughtById(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })  // find one thought by id
      .select("-__v")
      .then(async (thought) =>
        !thought
          ? res.status(404).json({"message" : "No thought found with this id"})
          : res.json({
              thought,
            })
      )
      .catch((err) => {
        console.log(err);
        res.status(400).json({"error" : err.name + ": " + err.message})
      });
  },
  // create thought
  createThought(req, res) {
    Thought.create(req.body)  // create thought with data from req.body
      .then((thought) => res.json(thought))
      .catch((err) => {
        console.log(err);
        res.status(400).json({"error" : err.name + ": " + err.message})
      });
  },
  // update thought by id
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },  // find thought by id
      { $set: req.body },  // update thought with data from req.body
      { runValidators: true, new: true } // validate data and return updated thought
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({"message" : "No thought found with this id"})
          : res.json(thought)
      )
      .catch((err) => {
        console.log(err);
        res.status(400).json({"error" : err.name + ": " + err.message})
      });
  },
  // delete thought by id
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({"message" : "No thought found with this id"})
          : User.findOneAndUpdate(
              { thoughts: req.params.thoughtId },  // find thought by id
              { $pull: { thoughts: req.params.thoughtId } }, // remove thought
              { new: true } // return updated user
            )
      )
      .then((user) => 
        !user
          ? res.status(404).json({"message" : "No user found with this id"})
          : res.json({ message: "Thought deleted!" })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // get all reactions
  getAllReactions(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })  // find one thought by id and all reactions to it
      .select("-__v")
      .then((thought) =>
        !thought
          ? res.status(404).json({"message" : "No thought found with this id"})
          : res.json(thought.reactions)
      )
      .catch((err) => {
        console.log(err);
        res.status(400).json({"error" : err.name + ": " + err.message})
      });
  },
  // get one reaction by thoughtId where reactionId is the _id of the reaction
  getReactionById(req, res) {
    Thought.find(
      { _id: req.params.thoughtId },  // I think this is where the problem is 🤨
      { "reactions._id": req.params.reactionId } // or maybe the problem is here 🤨
      )
      .select("-__v")
      .then((thought) =>
        !thought
          ? res.status(404).json({"message" : "No thought found with this id"})
          : res.json(thought)
      )
      .catch((err) => {
        console.log(err);
        res.status(400).json({"error" : err.name + ": " + err.message})
      });
  },
  // create reaction
  createReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId }, // search query for the thought
      { $push: { reactions: req.body } }, // field: values to update
      { runValidators: true, new: true }  // validate before update and return a new document
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({"message" : "No thought found with this id"})
          : res.json(thought)
      )
      .catch((err) => {
        console.log(err);
        res.status(400).json({"error" : err.name + ": " + err.message})
      });
  },
  // delete reaction
  deleteReaction(req, res) {
    console.log(req.params.reactionId)
    console.log(req.params.thoughtId)
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },  // search query for the thought  this might be the problem 🤨
      { $pull: { reactions: { _id: req.params.reactionId } } }, // field: values to update  this might be the problem 🤨
      { runValidators: true, new: true }   // validate before update and return a new document
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({"message" : "No thought found with this id"})
          : res.json(thought)
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
};
