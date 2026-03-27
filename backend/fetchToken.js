require('dotenv').config({ path: './.env.local' });
const mongoose = require('mongoose');
const VerificationToken = require('./models/VerificationToken');

const fetchToken = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const tokens = await VerificationToken.find({}).sort({ createdAt: -1 }).limit(1);
        console.log('Latest token:', tokens[0] ? tokens[0].token : 'None');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

fetchToken();
