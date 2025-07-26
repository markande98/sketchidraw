import { currentUser } from "@/lib/auth";
export default async function Home() {
  const user = await currentUser();
  console.log(user);
  return <div>{user?.name ? `Hi, ${user.name}` : "No user added yet"}</div>;
}
