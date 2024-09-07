import { useState, useEffect } from "react";
import axios from "axios";

const useParticipants = () => {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await axios.get("http://localhost:3000/");
        setParticipants(response.data.participants || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchParticipants();
  }, []);

  return [participants, setParticipants];
};

export default useParticipants;
