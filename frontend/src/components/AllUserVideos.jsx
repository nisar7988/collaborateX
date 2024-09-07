import React from "react";
import ReactPlayer from "react-player";
const AllUserVideos = ({allStreams}) => {

 console.log(allStreams);
return(
    <div className="mai00000001
    
    
    
    nn-container">\
       {allStreams.map((stream,index)=>{
      return (
      <div key={index} className="video-player">
        <ReactPlayer
          autoPlay
          playing
          muted
          url={stream}
          width="300px"
          height="auto"
        />
      </div>
      )
    })}
    </div>
)
};

export default AllUserVideos;
