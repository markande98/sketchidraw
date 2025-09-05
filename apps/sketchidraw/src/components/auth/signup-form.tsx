"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SignUpSchema } from "@repo/db";
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
import { signup } from "@/actions/signup";
import { FormError } from "./form-error";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const SignUpform = () => {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof SignUpSchema>) => {
    setError("");
    startTransition(() => {
      signup(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
            return;
          }
          router.push("/auth/signin");
          router.refresh();
          toast.success(data.success);
        })
        .catch(() => setError("Something went wrong!"));
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm dark:text-neutral-300">
                  Username
                </FormLabel>
                <FormControl>
                  <Input
                    className="dark:bg-[#121212] dark:border-none inline-block p-5 dark:border-[#212121] dark:border-[1px] dark:rounded-[.25rem] dark:shadow-[0_0_0_1px_#212121] dark:focus:ring-violet-400 dark:text-[#ced4da] leading-1 whitespace-nowrap"
                    {...field}
                    placeholder="john"
                  />
                </FormControl>
              </FormItem>
            )}
          />
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
          type="submit"
          className="w-full cursor-pointer bg-blue-500 hover:bg-blue-400 dark:bg-violet-400 dark:hover:bg-violet-300 duration-150"
        >
          Sign up
        </Button>
      </form>
    </Form>
  );
};
