import type { NextConfig } from "next";
import path from 'path';
const nextConfig: NextConfig = {
   turbopack: {
    root: path.join(__dirname), // This points to C:\Users\Administrator\Desktop\myblogs
  },
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol:"https",
        hostname:"lh3.googleusercontent.com"
      }
      // Add more patterns if needed
      // {
      //   protocol: "https",
      //   hostname: "example.com",
      // },
    ],
  },
};

export default nextConfig;