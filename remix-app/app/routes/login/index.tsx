import { Input } from "@/components/ui/input";
import { loginUser } from "./actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getUser } from "@/lib/utils/server";

export default async function LoginPage() {
  const user = await getUser();
  if (user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">You are already logged in!</h1>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-6 p-4 justify-center items-center mx-auto"
      action={loginUser}
    >
      <div className="flex gap-2 w-full">
        <Label htmlFor="email" className="flex-1 justify-end">
          Email:
        </Label>
        <Input
          className="w-[200px]"
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
          minLength={5}
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
  );
}
