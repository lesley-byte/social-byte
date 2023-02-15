const connection = require("../config/connection");
const { User, Thought } = require("../models");
const {
  getRandomName,
  getRandomThoughtDescription, // need to use this function to get a random thought description
  getRandomReactionDescription, // need to use this function to get a random reaction description
  getRandomUser, // need to use this function to get a random user
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
    users.push({ username, email, password });
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
