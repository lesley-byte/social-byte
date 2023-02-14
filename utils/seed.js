const connection = require('../config/connection');
const { User, Thought } = require('../models');
const { getRandomName, getRandomThoughtDescription, getRandomReactionDescription } = require('./data');

connection.on('error', (err) => console.log(err));

connection.once('open', async () => {
    console.log('Connected to MongoDB');

    await User.deleteMany({});

    await Thought.deleteMany({});

    const users = [];

    for (let i = 0; i < 10; i++) {
        const username = getRandomName();
        const email = `${username.toLowerCase().split(' ').join('')}@gmail.com`;
        const password = 'password123';
        const user = new User({ username, email, password });
        users.push(user);
        await user.save();
    }

    await User.collection.insertMany(users);

    await Thought.collection.insertOne({
        thoughtText: 'This is a test thought',
        createdAt: new Date(),
        users: [...users],
        reactions: [
            {
                reactionBody: 'This is a test reaction',
                username: users[0].username,
                createdAt: new Date()
            }
        ]
    });

    console.table(users);
    console.info('Seeding complete! 🌱');
    process.exit(0);
});