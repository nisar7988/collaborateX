const User = require ('../models/user.model');

async function handleProfileUpdate (req, res) {
  let {profile, userId} = req.body;

  try {
    let updateFields = {};
    for (let key in profile) {
      if (profile.hasOwnProperty (key) && profile[key] !== '') {
        updateFields[key] = profile[key];
      }
    }
    const updatedUser = await User.findByIdAndUpdate (
      userId,
      {$set: updateFields},
      {new: true}
    );

    if (updatedUser) {
      console.log ('Profile updated successfully', updatedUser);
      res.status (201).json (updatedUser);
    } else {
      console.log ('User not found');
      return null;
    }
  } catch (err) {
    console.error ('Error updating profile:', err);
    throw err;
  }
}

async function removeProfilePic (req,res) {
  let {userId} = req.body;
  console.log(userId);
  try {
    const updatedUser = await User.findByIdAndUpdate (
      userId,
      {profilePicture: null},
      {new: true}
    );

    if (updatedUser) {
      console.log ('Profile updated successfully', updatedUser);
      res.status (201).json ({user:updatedUser});
    } else {
      console.log ('User not found');
      return null;
    }
  } catch (err) {
    console.error ('Error updating profile:', err);
    throw err;
  }
}

module.exports = {
  handleProfileUpdate,
  removeProfilePic,
};
