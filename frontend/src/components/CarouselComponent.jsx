import { Carousel } from 'flowbite-react';
import { CiLink } from "react-icons/ci";
import { MdOutlineSecurity } from "react-icons/md";
import { FaPeopleLine } from "react-icons/fa6";

const CarouselComponent = () => {
  const slides = [
    {
      icon: <CiLink size={100} />,
      text: "Get a link to share!"
    },
    {
      icon: <MdOutlineSecurity size={100} />,
      text: "Secure Video Calls!"
    },
    {
      icon: <FaPeopleLine size={100} />,
      text: "Start Meeting in just one click!"
    },
  ];

  return (
    <div className="relative w-full mx-5">
      <Carousel 
      >
        {slides.map((slide, index) => (
          <div key={index} className="relative flex flex-col items-center justify-center h-64 bg-sky-700 rounded-md text-white">
            <div className="flex items-center justify-center w-32 h-32 rounded-full">
              {slide.icon}
            </div>
            <div>
            <p className="text-center ">{slide.text}</p>
            </div>
          </div>
        ))}
      </Carousel>

 
    </div>
  );
};

export default CarouselComponent;
