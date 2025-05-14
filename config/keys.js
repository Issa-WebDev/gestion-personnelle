require("dotenv").config();
const dbPassword = process.env.MONGO_URI;
console.log(dbPassword); // Replace with your actual MongoDB connection string

module.exports = {
  mongoURI: dbPassword,
};
