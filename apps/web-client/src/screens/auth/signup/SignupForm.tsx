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

import useSignup from "./useSignup";

const SignupForm = () => {
  const { form, isPending, onSubmit } = useSignup();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-label text-sm font-medium">
                First Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="First name"
                  autoComplete="given-name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-label text-sm font-medium">
                Last Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Last name"
                  autoComplete="family-name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                  placeholder="Create a password"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="h-12 w-full" disabled={isPending}>
          {isPending ? (
            <Loading variant="inverse" size="sm" />
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SignupForm;
