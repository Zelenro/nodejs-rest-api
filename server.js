import mongoose from 'mongoose';
import app from './app.js';

const DB_HOST =
  'mongodb+srv://Zelenro:h1X6fbcuxQXMsiiP@cluster0.xf65sxt.mongodb.net/db-contacts?retryWrites=true&w=majority';

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(3000, () => {
      console.log('Database connection successful');
    });
  })
  .catch(error => {
    console.log(error.message);
    process.exit(1);
  });
