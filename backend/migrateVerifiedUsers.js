require('dotenv').config({ path: './.env.local' });
const mongoose = require('mongoose');
const User = require('./models/User');

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const result = await User.updateMany(
            {},
            { $set: { isVerified: true } }
        );
        console.log('Migration complete:', result);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

migrate();
