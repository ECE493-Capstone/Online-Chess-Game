const { MongoClient, ServerApiVersion } = require("mongodb");
const mongoose = require("mongoose");
const Queue = require("./models/Queue");
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
  await Queue.deleteMany({});
};
module.exports = connect;
