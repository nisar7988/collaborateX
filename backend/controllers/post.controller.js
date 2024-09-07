const User = require("../models/user.model");
const cloudinary = require('cloudinary').v2;
const fs = require('fs')


const handleUpload=async (req, res) => {
  const { file } = req;
  const { userName } = req.body;

  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'profile_pics',
      public_id: `${userName}_profile_pic`,
    });

    // Save the Cloudinary URL in the database
    const userProfile = await User.findOneAndUpdate(
      { username: userName },
      { profilePicture: result.secure_url },
      { new: true } 
    );

    // Remove the temporary file
    fs.unlinkSync(file.path);
console.log(userProfile)
    res.status(201).json({ message: 'File uploaded successfully', user:userProfile });
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).send('Server error');
  }
}

const removeProfilePic = async(req,res)=>{
  console.log("removeprofile runs and username is ",req.body);
  try {
   const user = await User.findOneAndUpdate(
    { username:req.body.userName},
    { $set: { profilePicture: req.file } },
    {new:true}
   )
    if(!user){
        return res.status(404).json({error:"User not found"})
    }
  
    res.status(201).json({"message":"profile uploaded",user});
  } catch (error) {
    res.status(500).json({ error: "Failed to save post" });
  }
}
module.exports = { handleUpload,removeProfilePic };
