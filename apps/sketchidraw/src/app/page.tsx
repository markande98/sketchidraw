import { prisma } from "@repo/db";

export default async function Home() {
  const user = await prisma.user.findFirst();
  return <div>{user?.name ?? "No user added yet"}</div>;
}
