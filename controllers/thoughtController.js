// TODO: fill this in
const { Thought, User } = require('../models');

module.exports = {
    // get all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
        .then((thoughts) => res.json(thoughts))
        .catch((err) => res.status(400).json(err));
    },
    // get one thought by id
    getThoughtById(req,res) {
        Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v')
        .then((thought) => 
        !thought ? res.status(404).json({ message: 'No thought found with this id!' }) : res.json(thought)
        )
        .catch((err) => res.status(400).json(err));
    },
    // create thought
    createThought(req, res) {
        Thought.create(req.body)
        .then((thought) => res.json(thought))
        .catch((err) => res.status(400).json(err));
    },
    // update thought by id
    updateThought(req, res) {
        Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
        )
        .then((thought) =>
        !thought ? res.status(404).json({ message: 'No thought found with this id!' }) : res.json(thought)
        )
        .catch((err) => res.status(400).json(err));
    },
    // delete thought by id
    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
        .then((thought) =>
        !thought ? res.status(404).json({ message: 'No thought found with this id!' }) : res.json(thought)
        )
        .catch((err) => res.status(400).json(err));
    },
    // create reaction
    createReaction(req, res) {
        Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $push: { reactions: req.body } },
        { runValidators: true, new: true }
        )
        .then((thought) =>
        !thought ? res.status(404).json({ message: 'No thought found with this id!' }) : res.json(thought)
        )
        .catch((err) => res.status(400).json(err));
    },
    // delete reaction
    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
        )
        .then((thought) =>
        !thought ? res.status(404).json({ message: 'No thought found with this id!' }) : res.json(thought)
        )
        .catch((err) => res.status(400).json(err));
    },
};
