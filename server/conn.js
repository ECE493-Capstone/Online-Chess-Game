const { MongoClient, ServerApiVersion } = require("mongodb");
const mongoose = require("mongoose");
require("dotenv").config();

const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const connect = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
};
module.exports = connect;
