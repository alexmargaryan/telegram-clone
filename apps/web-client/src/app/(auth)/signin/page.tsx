import Link from "next/link";

import SigninForm from "@/screens/auth/signin/SigninForm";
import SigninGoogleForm from "@/screens/auth/signin/SigninGoogleForm";

export default function Signin() {
  return (
    <div className="space-y-6">
      <SigninForm />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="text-description bg-white px-2">
            Or continue with
          </span>
        </div>
      </div>

      <SigninGoogleForm />

      <div className="text-center">
        <p className="text-description text-sm">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-primary hover:text-primary/80 font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
