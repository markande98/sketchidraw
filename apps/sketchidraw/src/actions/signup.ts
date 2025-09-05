"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@repo/db/client";
import { SignUpSchema } from "@repo/db";

export const signup = async (values: z.infer<typeof SignUpSchema>) => {
  const validateFields = SignUpSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid Fields!" };
  }

  const { email, password, username } = validateFields.data;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return { error: "Email already in use." };
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    return { success: "User created, try signin" };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong!";
    return { error: errorMessage };
  }
};
