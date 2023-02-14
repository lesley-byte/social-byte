const names = ['John', 'Paul', 'George', 'Ringo'];
const thoughtDescriptions = [
    'Beatles are the best band ever',
    'I love the Beatles',
    'I love John Lennon',
    'I love Paul McCartney',
    'I love George Harrison',
    'I love Ringo Starr',
    'I love the Beatles songs'
];
const reactionDescriptions = [
    'I agree',
    'I disagree',
    'I love the Beatles too',
    'I love John Lennon too',
    'I love Paul McCartney too',
    'I love George Harrison too',
    'I love Ringo Starr too',
    'I love the Beatles songs too'
];

const getRandomArrItem = arr => arr[Math.floor(Math.random() * arr.length)];

const getRandomName = () => 
    `${getRandomArrItem(names)} ${getRandomArrItem(names)}`;

const getRandomThoughtDescription = (int) => {
    let description = '';
    for (let i = 0; i < int; i++) {
        description += `${getRandomArrItem(thoughtDescriptions)} `;
    }
    return description;
};

const getRandomReactionDescription = (int) => {
    let description = '';
    for (let i = 0; i < int; i++) {
        description += `${getRandomArrItem(reactionDescriptions)} `;
    }
    return description;
};

module.exports = { getRandomName, getRandomThoughtDescription, getRandomReactionDescription };

