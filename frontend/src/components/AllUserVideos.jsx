import React from "react";
import ReactPlayer from "react-player";
const AllUserVideos = ({peers,Video}) => {

 console.log(peers);
return(
    <div className="main-container grid grid-1 overflow-y-auto h-[inherit]  ">
      {  peers.length > 0 && peers.map((peer, index) => {
                return (
                  <div className="video  object-fit-contain">
                    <Video peer={peer} key={index}/>
                  </div>
                );
              })
       }
    </div>
)
};

export default AllUserVideos;
