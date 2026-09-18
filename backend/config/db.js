const mongoose = require("mongoose");
const dns = require("node:dns");

const connectDB = async () => {
  try {
    // Node.js ke liye public DNS servers set karna
    dns.setServers(["1.1.1.1", "8.8.8.8"]);

    console.log("MONGO_URI exists:", !!process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Failed:");
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;