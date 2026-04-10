export const runtime = 'edge'
import { NextResponse } from 'next/server'

/* ===== 五行（内部用） ===== */
function getWuXing(birthDate: string) {
  const year = new Date(birthDate).getFullYear()
  const elements = ["木", "火", "土", "金", "水"]
  return elements[year % 5]
}

/* ===== 五行倾向（隐藏） ===== */
function getWuXingTrait(element: string) {
  switch (element) {
    case "木":
      return "更容易往外延展，不太会长期停在固定结构里"
    case "火":
      return "容易被环境带动，变化会来得比较快"
    case "土":
      return "前期会维持稳定，但一旦动起来就会慢慢偏移"
    case "金":
      return "能在结构里待住，但不会完全被束缚"
    case "水":
      return "本身流动性强，很难一直停在一个位置"
    default:
      return ""
  }
}

/* ===== 时辰倾向 ===== */
function getShiChenTrait(hour: number) {
  if (hour >= 23 || hour < 1) return "很多变化是慢慢积累的"
  if (hour >= 1 && hour < 5) return "思考深，但行动有延迟"
  if (hour >= 5 && hour < 9) return "行动力比较强"
  if (hour >= 9 && hour < 17) return "适应现实结构能力强"
  if (hour >= 17 && hour < 21) return "更容易被情绪和关系影响"
  return "更容易在变化中做决定"
}

/* ===== 推理底稿（核心升级） ===== */
function buildLogic(trait: string, shiTrait: string, background: string, recent: string) {
  return `
这个人现在的人生，是在一条已经形成的轨道上继续往前走的。

但从他过往的背景来看：
${background}

再叠加他最近这一段时间发生的事情：
${recent}

这些变化本身并不是孤立的，而是在一点一点改变他原来的状态。

从他的内在倾向来看：${trait}。
再叠加他的节奏特点：${shiTrait}。

这两点放在一起，会让他在原本的路径里还能继续待着，但内在已经开始慢慢偏移。

这种偏移现在还不完全明显，但已经在形成，而且不会停下来。
`
}

/* ===== 主函数 ===== */
export async function POST(req: Request) {
  try {
    const { birthDate, birthTime, background, recent } = await req.json()

    const element = getWuXing(birthDate)
    const trait = getWuXingTrait(element)

    const hour = birthTime
      ? parseInt(birthTime.split(':')[0])
      : 12 // 默认中午

    const shiTrait = getShiChenTrait(hour)

    const logic = buildLogic(trait, shiTrait, background, recent)

    const prompt = `
你在看一个人的人生轨迹。

下面是已经整理好的判断逻辑：

${logic}

你要做的是：
顺着这个人的状态，慢慢往后讲他接下来会怎么变化。

必须严格遵守：

1. 不要写小说，不要编生活细节
（禁止出现具体时间、地点、食物、对话）

2. 不要分析腔
（不要说“根据你的情况”“说明了”）

3. 不要分点

4. 不要出现：
“可能 / 也许 / 大概”

5. 只写一条往前走的路径

6. 必须有时间推进：
（接下来 → 再往后 → 到后面）

7. 语气像人在慢慢讲

8. 不要总结结尾

9. 不要提五行、命理、时辰这些词

10. 至少800字

现在直接开始。
`

    const res = await fetch(
      "https://ark.cn-beijing.volces.com/api/v3/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.DOUBAO_API_KEY}`
        },
        body: JSON.stringify({
          model: "doubao-seed-2-0-pro-260215",
          messages: [{ role: "user", content: prompt }]
        })
      }
    )

    const data = await res.json()

    return NextResponse.json({
      result: data.choices?.[0]?.message?.content || "生成失败"
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ result: "出错了" })
  }
}