const connection = require("../config/connection");
const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require("../models");
const {
  getRandomName,
  getRandomThoughtDescription, // need to use this function to get a random thought description
  getRandomReactionDescription, // need to use this function to get a random reaction description
  getRandomArrItem, // need to use this function to get a random item from an array
} = require("./data");

connection.on("error", (err) => console.log(err));

connection.once("open", async () => {
  console.log("Connected to MongoDB");

  await User.deleteMany({});
  console.log("Users deleted! 🗑️")
  await Thought.deleteMany({});
  console.log("Thoughts deleted! 🗑️")

  let users = [];

  for (let i = 0; i < 10; i++) {
    const username = getRandomName();
    const email = `${username.toLowerCase().split(" ").join("")}@gmail.com`;
    const password = "password123";
    let friends = [];
    for (let i = 0; i < 4; i++) {
      try {
      // get a random user object from users array and use ObjectID to convert the _id to a string
        let friend = await getRandomArrItem(users);
        // console.log(friend);
          // use ObjectId to convert the _id to a string
          console.log(`_id: ${new ObjectId(friend._id)}, username: ${friend.username}`);
          // change friend to new ObjectId(friend._id)
          friend = new ObjectId(friend._id);
        // if friend not already in friends array, add it
          if (!friends.includes(friend)) {
          friends.push(friend);
        } else {
          console.log("No friends found! 🤷‍♀️")
        }
      } catch (err) {
        console.log(err);
      }
    }
    users.push({ username, email, password, friends });
  }
  console.log("Users created! 🧑‍🤝‍🧑")

  let thoughts = [];

  for (let i = 0; i < 10; i++) {
    const thoughtText = getRandomThoughtDescription(5);
    const thoughtAuthor = getRandomName();
    let reactions = [];
    for (let i = 0; i < 10; i++) {
      const reactionBody = getRandomReactionDescription(5);
      // get random user to assign as reaction author
      const reactionAuthor = getRandomArrItem(users).username;
      reactions.push({ reactionBody, reactionAuthor });
    }
    thoughts.push({ thoughtText, thoughtAuthor, reactions });
  }


  await User.collection.insertMany(users);
  console.log("Users inserted! 🧑‍🤝‍🧑")

  await Thought.collection.insertMany(thoughts);
  console.log("Thoughts inserted! 🧠")


  console.table(users);
  console.table(thoughts);
  console.info("Seeding complete! 🌱");
  process.exit(0);
});
