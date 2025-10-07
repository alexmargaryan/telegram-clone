import Link from "next/link";

import SignupForm from "@/screens/auth/signup/SignupForm";

export default function Signup() {
  return (
    <div className="space-y-6">
      <SignupForm />

      <div className="text-center">
        <p className="text-description text-sm">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-primary hover:text-primary/80 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
