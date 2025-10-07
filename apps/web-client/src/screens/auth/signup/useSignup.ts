"use client";

import { useRouter } from "next/navigation";
import { useForm, UseFormReturn } from "react-hook-form";

import { useAuthControllerSignup } from "@/api/generated/queries";
import { zodResolver } from "@hookform/resolvers/zod";

import { SignupSchema } from "./signupSchema";
import { SignupForm } from "./types";

interface UseSignupReturn {
  form: UseFormReturn<SignupForm>;
  isPending: boolean;
  onSubmit: (data: SignupForm) => void;
}

const useSignup = (): UseSignupReturn => {
  const router = useRouter();

  const { mutate: signup, isPending } = useAuthControllerSignup({
    mutation: {
      onSuccess: () => {
        router.replace("/");
      },
    },
  });

  const form = useForm<SignupForm>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(SignupSchema),
  });

  const onSubmit = (data: SignupForm) => {
    signup({ data });
  };

  return {
    form,
    isPending,
    onSubmit,
  };
};

export default useSignup;
