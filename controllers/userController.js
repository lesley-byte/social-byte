const { ObjectId } = require('mongoose').Types;
const {Thought, User } = require('../models');

//Aggregate function to get the number of users overall
const userCount = async () => 
    User.aggregate()
    .count('userCount')
    .then((numberofUsers) => numberofUsers);

const thoughtCount = async () => 
    Thought.aggregate()
    .count('thoughtCount')
    .then((numberofThoughts) => numberofThoughts);

const friendCount = async () => 
    User.aggregate()
    .unwind('friends')
    .group({ _id: null, friendCount: { $sum: 1 } })
    .then((numberofFriends) => numberofFriends);
// TODO: finish this
