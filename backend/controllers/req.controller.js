const User = require("../models/user.model");

const sendUsers = async (req, res) => {
  console.log("sendUser runs");
  try {
    const users = await User.find();
    console.log(users);
 const usersData =[]
 users.forEach((user) => {
    usersData.push({
        username:user.username,
        name:user.name
    });
    }); 
    res.json(usersData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving users" });
  }
};

module.exports = { sendUsers };
