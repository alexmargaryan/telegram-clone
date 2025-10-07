"use client";

import Loading from "@/components/common/Loading";
import PasswordInput from "@/components/common/PasswordInput";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import useSignin from "./useSignin";

const SigninForm = () => {
  const { form, isPending, error, onSubmit } = useSignin();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-label text-sm font-medium">
                Email
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your email"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-label text-sm font-medium">
                Password
              </FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && (
          <div className="border-error-border bg-error-bg border p-3">
            <p className="text-error text-sm">
              {error.response?.data.message ?? "Something went wrong"}
            </p>
          </div>
        )}
        <Button type="submit" className="h-12 w-full" disabled={isPending}>
          {isPending ? <Loading variant="inverse" size="sm" /> : "Sign In"}
        </Button>
      </form>
    </Form>
  );
};

export default SigninForm;
