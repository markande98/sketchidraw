"use server";

import { prisma } from "@repo/db";

export const createRoom = async (userId: string) => {
  try {
    const room = await prisma.room.create({
      data: {
        userId,
      },
    });
    return room.id;
  } catch (error) {
    throw error;
  }
};
