import {
  Footer,
  FooterBrand,
  FooterCopyright,
  FooterDivider,
  FooterIcon,
  FooterLink,
  FooterLinkGroup,
  FooterTitle,
} from "flowbite-react";
import {
  BsDribbble,
  BsFacebook,
  BsGithub,
  BsInstagram,
  BsTwitter,
} from "react-icons/bs";

export function FooterComponent() {
  return (
    <Footer>
      <div className="w-full bg-black px-2 py-2 absolute bottom-0">
        <div className="w-full flex justify-center items-center">
          <FooterCopyright href="#" by="CollaborateX" year={2024} />
        </div>
      </div>
    </Footer>
  );
}
