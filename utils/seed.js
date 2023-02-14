const connection = require("../config/connection");
const { User, Thought } = require("../models");
const {
  getRandomName,
  getRandomThoughtDescription,
  getRandomReactionDescription,
} = require("./data");

connection.on("error", (err) => console.log(err));

connection.once("open", async () => {
  console.log("Connected to MongoDB");

  await User.deleteMany({});
  await Thought.deleteMany({});

  let users = [];

  for (let i = 0; i < 10; i++) {
    const username = getRandomName();
    const email = `${username.toLowerCase().split(" ").join("")}@gmail.com`;
    const password = "password123";
    users.push({ username, email, password });
  }

  await User.collection.insertMany(users);

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

  console.table(users);
  console.info("Seeding complete! 🌱");
  process.exit(0);
});
