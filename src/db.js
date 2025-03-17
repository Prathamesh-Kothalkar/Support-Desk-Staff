const mongoose = require("mongoose");

const connection = {};

export const connectToDB = async () => {
  try {
      if (connection.isConnected) return;
      const db = await mongoose.connect(process.env.DBURL);
       connection.isConnected = db.connections[0].readyState;
  } catch (error) {
      console.log(error);
      throw new Error(error);
  }
};