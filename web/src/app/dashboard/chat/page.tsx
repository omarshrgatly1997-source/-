import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { ChatClient } from "./chat-client";

export const metadata = { title: "المساعد الذكي" };

export default async function ChatPage() {
  const user = await getCurrentUser();
  const initialMessages = user
    ? await prisma.chatMessage.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "asc" },
        take: 50,
      })
    : [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">المساعد الذكي</h1>
        <p className="mt-1 text-sm text-neutral-400">
          اسأل عن أي شيء يخص استراتيجياتنا المنشورة وسيجيبك المساعد فورًا.
        </p>
      </div>
      <ChatClient
        initialMessages={initialMessages.map((m) => ({
          id: m.id,
          role: m.role as "user" | "assistant",
          content: m.content,
        }))}
      />
    </div>
  );
}
