"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SignInSchema } from "@repo/db";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState, useTransition } from "react";
import { signin } from "@/actions/signin";
import { FormError } from "./form-error";
import { toast } from "sonner";

export const SignInForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof SignInSchema>) => {
    setError("");
    startTransition(() => {
      signin(values)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
            return;
          }
          toast.success("Logged In");
          setTimeout(() => {
            window.location.href = "/";
          }, 1000);
        })
        .catch(() => setError("Something went wrong!"));
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm dark:text-neutral-300">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    className="dark:bg-[#121212] dark:border-none inline-block p-5 dark:border-[#212121] dark:border-[1px] dark:rounded-[.25rem] dark:shadow-[0_0_0_1px_#212121] dark:focus:ring-violet-400 dark:text-[#ced4da] leading-1 whitespace-nowrap"
                    {...field}
                    placeholder="johndoe@example.com"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm dark:text-neutral-300">
                  Password
                </FormLabel>
                <FormControl>
                  <Input
                    className="dark:bg-[#121212] dark:border-none inline-block p-5 dark:border-[#212121] dark:border-[1px] dark:rounded-[.25rem] dark:shadow-[0_0_0_1px_#212121] dark:focus:ring-violet-400 dark:text-[#ced4da] leading-1 whitespace-nowrap"
                    {...field}
                    placeholder="******"
                    type="password"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormError message={error} />
        <Button
          disabled={isPending}
          variant="default"
          type="submit"
          className="w-full cursor-pointer bg-blue-500 hover:bg-blue-400 dark:bg-violet-400 dark:hover:bg-violet-300 duration-150"
        >
          Sign in
        </Button>
      </form>
    </Form>
  );
};
