"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Default_Login_Redirect } from "@/routes";

export const Social = () => {
  const onClick = (provider: "google" | "facebook") => {
    signIn(provider, {
      callbackUrl: Default_Login_Redirect,
    });
  };
  return (
    <div className="flex items-center gap-x-2">
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => onClick("google")}
      >
        <FcGoogle />
      </Button>
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => onClick("facebook")}
      >
        <FaFacebookF />
      </Button>
    </div>
  );
};
