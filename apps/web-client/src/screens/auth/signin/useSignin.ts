"use client";

import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useForm, UseFormReturn } from "react-hook-form";

import { useAuthControllerSignin } from "@/api/generated/queries";
import { ApiError } from "@/api/types";
import { zodResolver } from "@hookform/resolvers/zod";

import { SigninSchema } from "./signinSchema";
import { SigninForm } from "./types";

interface UseSigninReturn {
  form: UseFormReturn<SigninForm>;
  isPending: boolean;
  error: AxiosError<ApiError> | null;
  onSubmit: (data: SigninForm) => void;
}

const useSignin = (): UseSigninReturn => {
  const router = useRouter();

  const {
    mutate: signin,
    isPending,
    error,
  } = useAuthControllerSignin<AxiosError<ApiError>>({
    mutation: {
      onSuccess: () => {
        router.replace("/");
      },
    },
  });

  const form = useForm<SigninForm>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(SigninSchema),
  });

  const onSubmit = (data: SigninForm) => {
    signin({ data });
  };

  return {
    form,
    isPending,
    error,
    onSubmit,
  };
};

export default useSignin;
