"use client";
import { image_path } from "@/environment";
/* eslint-disable @next/next/no-img-element */
import React from "react";


interface Image {
  className?: string;
  src: string;
  alt?: string;
  height?: number;
  width?: number;
  id?:string;
}

const ImageWithBasePath = (props: Image) => {
  const isBase64OrUrl = props.src.startsWith('data:') || 
                        props.src.startsWith('http://') || 
                        props.src.startsWith('https://') ||
                        props.src.startsWith('blob:');
  
  const fullSrc = isBase64OrUrl ? props.src : `${image_path}${props.src}`;
  
  return (
    <img
      className={props.className}
      src={fullSrc}
      height={props.height}
      alt={props.alt}
      width={props.width}
      id={props.id}
    />
  );
};

export default React.memo(ImageWithBasePath);
