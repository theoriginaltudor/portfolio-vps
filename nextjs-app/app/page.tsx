import { AvatarWithShadow } from "@/components/avatar-with-shadow";
import { ChatBox } from "@/feature-components/chat-box";

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
