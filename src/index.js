import dotenv from 'dotenv';
dotenv.config();
console.log('port',process.env.PORT)
import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
