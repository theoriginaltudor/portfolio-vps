import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <AvatarWithShadow />
        <ChatBox />
      </div>
    </main>
  );
}
