
"use client";

import { Alert } from "flowbite-react";

export default function AlertComponent(props) {
  return (
    <Alert color={props.color} className='absolute top-0 w-screen  left-0'>
      <span className="font-medium">{props.text}</span> 
    </Alert>
  );
}
