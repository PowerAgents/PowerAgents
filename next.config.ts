import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["placehold.co", "tenor.com" ], // Add the external domain
    dangerouslyAllowSVG: true, // Allow SVG images (use with caution)
    contentSecurityPolicy: "default-src 'self'; img-src *; media-src *; script-src 'none'; sandbox;", // Optional: Add a stricter CSP for security
  },
  eslint:{
    ignoreDuringBuilds:true
    
  },
  typescript:{
    ignoreBuildErrors:true
  
  }

};

export default nextConfig;
