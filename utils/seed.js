const connection = require("../config/connection");
const { User, Thought } = require("../models");
const {
  getRandomName,
  getRandomThoughtDescription, // need to use this function to get a random thought description
  getRandomReactionDescription, // need to use this function to get a random reaction description
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

  await User.collection.insertMany(users);
  console.log("Users inserted! 🧑‍🤝‍🧑")

  await Thought.collection.insertOne({
    thoughtText: "This is a test thought",
    createdAt: new Date(),
    users: [...users],
    reactions: [
      {
        reactionBody: "This is a test reaction",
        // pick a random user from the users array
        username: users[Math.floor(Math.random() * users.length)].username,
        createdAt: new Date(),
      },
    ],
  });
  console.log("Thought inserted! 🧠")
  console.table(users);
  console.info("Seeding complete! 🌱");
  process.exit(0);
});
