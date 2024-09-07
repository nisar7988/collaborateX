import { useState, useEffect } from "react";

import axios from 'axios';
export default function useProfilePicture() {
  const [profilePic,setProfilePic] = useState(null)
    const loadProfilePicture = async () => {
      const usrJSON = localStorage.getItem('user');
      if (!usrJSON) {
        console.error('No user data in localStorage');
        return;
      }

      let usr;
      try {
        usr = JSON.parse(usrJSON);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        return;
      }

      const username = usr['username'];
      if (username) {
        try {
          const response = await axios.get('/api/req/profile-picture', {
            params: { username }
          });

          const imageUrl = response.data;
          setProfilePic(imageUrl);
            usr['profilePicture'] = imageUrl;
            localStorage.setItem('user', JSON.stringify(usr));
            console.log('Image saved to localStorage');
        } catch (err) {
          console.log('Cannot set profile picture', err);
        }
      }
return profilePic;
    };

}

