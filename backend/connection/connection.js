const mongoose = require('mongoose');
require('dotenv').config(); 

const dbURI = "mongodb+srv://nisarahmed7988:nisar048@cluster0.5yto5.mongodb.net/collaborateX?retryWrites=true&w=majority&appName=Cluster0";
const connectToDatabase = async () => {
  try {
    if (!dbURI) {y
      throw new Error('MONGODB_URI is not defined');
    }
    await mongoose.connect(dbURI);
    console.log('Connected to MongoDB Atlas');
  } catch (err) {
    console.error('Connection error:', err);
    process.exit(1); // Exit the process with failure code
  }
};

connectToDatabase();

const db = mongoose.connection;

module.exports = db;
