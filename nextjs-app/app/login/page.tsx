import { Input } from "@/components/ui/input";
import type { Metadata } from "next";
import { loginUser } from "./actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getUser } from "@/lib/utils/server";

export default async function LoginPage() {
  const user = await getUser();
  if (user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">You are already logged in! {user.username}</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-10">
      <form
        className="flex flex-col gap-6 p-4 justify-center items-center mx-auto"
        action={loginUser}
        >
        <div className="flex gap-2 w-full">
          <Label htmlFor="username" className="flex-1 justify-end">
            Username:
          </Label>
          <Input
            className="w-[200px]"
            id="username"
            name="username"
            type="text"
            required
            autoComplete="username"
            minLength={3}
            maxLength={254}
            />
        </div>
        <div className="flex gap-2 w-full">
          <Label htmlFor="password" className="flex-1 justify-end">
            Password:
          </Label>
          <Input
            className="w-[200px]"
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            maxLength={128}
            autoComplete="current-password"
            />
        </div>
        <Button type="submit">Log in</Button>
      </form>
      {/* <form
        className="flex flex-col gap-6 p-4 justify-center items-center mx-auto"
        action={registerUser}
      >
        <div className="flex gap-2 w-full">
          <Label htmlFor="username" className="flex-1 justify-end">
            Username:
          </Label>
          <Input
            className="w-[200px]"
            id="username"
            name="username"
            type="text"
            required
            autoComplete="username"
            minLength={3}
            maxLength={254}
          />
        </div>
        <div className="flex gap-2 w-full">
          <Label htmlFor="password" className="flex-1 justify-end">
            Password:
          </Label>
          <Input
            className="w-[200px]"
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            maxLength={128}
            autoComplete="current-password"
          />
        </div>
        <Button type="submit">Sign up</Button>
      </form> */}
    </div>
  );
}

export const metadata: Metadata = {
  title: "Login",
  description: "Secure access for managing portfolio content and data integration tasks.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Login – Tudor Caseru",
    description: "Authenticated access to management features.",
  url: "https://tudor-dev.com/login"
  }
};
