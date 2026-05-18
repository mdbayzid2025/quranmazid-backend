
import mongoose from 'mongoose';
import app from './app';

import colors from 'colors';
const port = 3002

async function main() {
    try {
        await mongoose.connect('mongodb://localhost:27017/quranmajid');
        console.log(colors.green('🚀 Database connected successfully'));


        app.listen(port, () => {
            console.log(colors.yellow(`♻️  Application listening on port:${port}`));
        });
    } catch (error) {
        console.error(error)
    }


}

main();
