export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const { birthDate, birthTime, background, recent, lang = "zh" } =
      await req.json()

    if (!process.env.DOUBAO_API_KEY) {
      return new Response("API Key 未配置", { status: 500 })
    }

    // 🌍 语言控制（关键）
    const langText =
      lang === "en"
        ? "Please write in English."
        : lang === "jp"
        ? "日本語で書いてください。"
        : "请用中文表达。"

    // 🔥 宿命感 + 多语言融合 prompt
    const prompt = `
${langText}

你不是在分析一个人，而是在“看到他的人生正在往哪里流动”。

你看到的不是结论，而是一种正在慢慢展开的轨迹。

你不会解释，也不会总结，你只是顺着时间，看见一些事情逐渐发生。

不要使用“可能”“也许”，
不要讲逻辑，
不要像在回答问题。

语气要自然，让人感觉这些变化已经在发生。

用户信息：

出生日期：${birthDate}
出生时间：${birthTime || "未知"}
个人背景：${background}
最近经历：${recent}

从现在开始，慢慢往后看。
`

    const upstream = await fetch(
      "https://ark.cn-beijing.volces.com/api/v3/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DOUBAO_API_KEY}`,
        },
        body: JSON.stringify({
          model: "doubao-seed-2-0-pro-260215",
          stream: true, // ✅ 流式输出
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      }
    )

    if (!upstream.ok || !upstream.body) {
      const error = await upstream.text()
      return new Response(error, { status: 500 })
    }

    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    const stream = new ReadableStream({
      async start(controller) {
        const reader = upstream.body!.getReader()
        let buffer = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })

          const lines = buffer.split("\n")
          buffer = lines.pop() || ""

          for (const line of lines) {
            if (!line.startsWith("data:")) continue

            const data = line.replace("data:", "").trim()

            if (data === "[DONE]") {
              controller.close()
              return
            }

            try {
              const json = JSON.parse(data)
              const content =
                json.choices?.[0]?.delta?.content || ""

              if (content) {
                controller.enqueue(encoder.encode(content))
              }
            } catch {}
          }
        }

        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    })
  } catch (err) {
    console.error(err)
    return new Response("服务器错误", { status: 500 })
  }
}