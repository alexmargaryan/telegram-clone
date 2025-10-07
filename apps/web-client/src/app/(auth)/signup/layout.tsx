import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create an account to get started",
};

export default function SignupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <div className="mb-8 text-center">
            <h1 className="text-heading mb-2 text-2xl font-bold">
              Create an account
            </h1>
            <p className="text-description">Join Telegram to start messaging</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
