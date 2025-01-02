'use client';

import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#5A8FF6]">
      {/* Sunset gradient background */}
      <div 
        className="absolute inset-0 animate-gradient-xy"
        style={{
          background: 'linear-gradient(-45deg, #996BEE, #5A8FF6, #996BEE, #5A8FF6)',
          backgroundSize: '400% 400%'
        }}
      />
      
      {/* Content container with glass effect */}
      <div className="relative flex flex-col items-center backdrop-blur-md">
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-xl backdrop-blur-lg bg-white/70 border border-white/50",
              headerTitle: "text-gray-800",
              headerSubtitle: "text-gray-600",
              socialButtonsBlockButton: "hover:scale-102 transform transition-transform",
              formButtonPrimary: "bg-primary-purple hover:bg-primary-blue transition-colors duration-300",
              footerActionLink: "text-primary-purple hover:text-primary-blue",
              formFieldInput: "bg-white/90 border-gray-200",
              formFieldLabel: "text-gray-700",
            },
          }}
          redirectUrl="/dashboard"
          afterSignInUrl="/dashboard"
          afterSignUpUrl="/dashboard"
        />
      </div>
    </div>
  );
} 