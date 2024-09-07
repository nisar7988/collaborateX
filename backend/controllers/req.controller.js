const User = require("../models/user.model");
const path = require('path')
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


const sendProfilePicture=async (req,res)=>{
  const { username } = req.query;
console.log(username)
try{
  const user = await User.findOne({username});
  const profilePicPath = user.profilePicture;
  if (profilePicPath) {
    console.log(profilePicPath)
    const uploadsDir = path.join( '..', 'uploads');
    const imagePath = path.join(uploadsDir, path.basename(profilePicPath));
    res.status(200).json(imagePath);
  } else {
    res.status(404).json({ message: 'Profile picture not found' });
  }
}
catch(err){
  console.log('could not find user ')
  res.status(400).json({"error":"could not find user profile picture"})
}
}

module.exports = { sendUsers ,sendProfilePicture};
