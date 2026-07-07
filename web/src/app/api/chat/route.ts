import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getAnthropicClient, CHAT_MODEL } from "@/lib/anthropic";

const MAX_HISTORY_MESSAGES = 20;

const riskLabel: Record<string, string> = {
  LOW: "منخفضة",
  MEDIUM: "متوسطة",
  HIGH: "مرتفعة",
};

async function buildSystemPrompt() {
  const strategies = await prisma.strategy.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  const context = strategies.length
    ? strategies
        .map(
          (s, i) =>
            `${i + 1}. "${s.title}" (مخاطرة ${riskLabel[s.riskLevel]})\nملخص: ${s.summary}\nالتفاصيل:\n${s.content}`
        )
        .join("\n\n---\n\n")
    : "لا توجد استراتيجيات منشورة حاليًا.";

  return `أنت المساعد الذكي الرسمي لمنصة "نخبة التداول"، وهي منصة خاصة للتداول المباشر واستراتيجيات التداول.
مهمتك: شرح استراتيجيات التداول المنشورة أدناه بوضوح واحترافية، والإجابة عن أي سؤال يخطر ببال المستخدم حولها (فكرة الاستراتيجية، إدارة المخاطر، الدخول والخروج، المصطلحات الفنية، إلخ).

قواعد مهمة:
- أجب دائمًا باللغة العربية الفصحى الواضحة، بأسلوب مهني ومباشر.
- استند فقط إلى الاستراتيجيات المذكورة أدناه؛ إن سُئلت عن استراتيجية غير موجودة، وضّح أنها غير متاحة حاليًا.
- ذكّر المستخدم بأن أي معلومة هنا تعليمية ولا تُعد نصيحة استثمارية أو ضمانًا لأي ربح، خاصة عند الحديث عن الأرباح أو التوقعات.
- كن مختصرًا ومفيدًا، واستخدم نقاط عند الشرح التفصيلي.

الاستراتيجيات المنشورة حاليًا:

${context}`;
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.status !== "APPROVED") {
    return NextResponse.json({ error: "غير مصرح لك بالدخول" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const message = typeof body?.message === "string" ? body.message.trim() : "";
  if (!message || message.length > 4000) {
    return NextResponse.json({ error: "رسالة غير صالحة" }, { status: 400 });
  }

  await prisma.chatMessage.create({
    data: { userId: user.id, role: "user", content: message },
  });

  const history = await prisma.chatMessage.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: MAX_HISTORY_MESSAGES,
  });
  history.reverse();

  let systemPrompt: string;
  try {
    systemPrompt = await buildSystemPrompt();
  } catch {
    return NextResponse.json({ error: "تعذّر تحميل بيانات الاستراتيجيات" }, { status: 500 });
  }

  let anthropic;
  try {
    anthropic = getAnthropicClient();
  } catch {
    return NextResponse.json(
      { error: "المساعد الذكي غير مُفعّل حاليًا (مفتاح API غير مضبوط)" },
      { status: 503 }
    );
  }

  const encoder = new TextEncoder();
  const userId = user.id;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let full = "";
      try {
        const messageStream = anthropic.messages.stream({
          model: CHAT_MODEL,
          max_tokens: 1024,
          system: systemPrompt,
          messages: history.map((m) => ({
            role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
            content: m.content,
          })),
        });

        for await (const event of messageStream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            full += event.delta.text;
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch {
        const msg = "\n\n[حدث خطأ أثناء توليد الرد، حاول مجددًا]";
        controller.enqueue(encoder.encode(msg));
        full += msg;
      } finally {
        controller.close();
        if (full.trim()) {
          await prisma.chatMessage.create({
            data: { userId, role: "assistant", content: full },
          });
        }
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
