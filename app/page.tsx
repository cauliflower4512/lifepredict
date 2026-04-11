'use client'

import { useState } from 'react'

export default function Home() {
  const [step, setStep] = useState<'input' | 'result'>('input')

  const [birthDate, setBirthDate] = useState('')
  const [birthTime, setBirthTime] = useState('')
  const [background, setBackground] = useState('')
  const [recent, setRecent] = useState('')
  const [result, setResult] = useState('')

  const [lang, setLang] = useState<'zh' | 'en' | 'jp'>('zh')

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

  const t = {
    zh: {
      title: "人生轨迹推演",
      subtitle: "输入你的信息，查看接下来的人生走势与建议",
      birthDate: "出生日期",
      birthTime: "出生时间（可选）",
      background: "例如：成长环境、家庭背景、MBTI、性格等…",
      recent: "例如：最近的变化、情绪、人际关系等…",
      submit: "开始推演",
      loading: "命运正在展开..."
    },
    en: {
      title: "Life Path Prediction",
      subtitle: "Explore your future trajectory",
      birthDate: "Date of Birth",
      birthTime: "Birth Time (Optional)",
      background: "e.g. personality, background...",
      recent: "e.g. recent changes...",
      submit: "Start",
      loading: "Analyzing..."
    },
    jp: {
      title: "人生軌跡の推演",
      subtitle: "未来の流れを確認",
      birthDate: "生年月日",
      birthTime: "出生時間（任意）",
      background: "例：性格や背景など",
      recent: "例：最近の変化など",
      submit: "開始",
      loading: "分析中..."
    }
  }[lang]

  const handleSubmit = async () => {
    setStep('result')
    setResult('')

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ birthDate, birthTime, background, recent, lang })
      })

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })

        for (let i = 0; i < chunk.length; i++) {
          fullText += chunk[i]
          setResult(fullText)
          await sleep(8)
        }
      }
    } catch {
      setResult('Error')
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#111111] relative overflow-hidden">

      {/* 🌍 语言切换 */}
      <div className="fixed top-6 right-6 z-[9999] flex gap-2">
        <button onClick={() => setLang('zh')} className={`px-3 py-1 text-xs rounded-full ${lang==='zh'?'bg-black text-white':'bg-white border'}`}>中文</button>
        <button onClick={() => setLang('en')} className={`px-3 py-1 text-xs rounded-full ${lang==='en'?'bg-black text-white':'bg-white border'}`}>EN</button>
        <button onClick={() => setLang('jp')} className={`px-3 py-1 text-xs rounded-full ${lang==='jp'?'bg-black text-white':'bg-white border'}`}>日本語</button>
      </div>

      {/* 🌟 背景光晕（你原来的） */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-white/70 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#e9eefc] blur-3xl" />
      </div>

      {/* ✅ LOGO（恢复） */}
      <div className="absolute top-5 left-5 text-[11px] tracking-[0.18em] text-[#9a9aa1]">
        早春花菜沙拉
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-xl flex-col px-6 py-16">

        {step === 'input' && (
          <>
            <div className="mb-12 text-center">
              <h1 className="text-[30px] font-medium tracking-tight">{t.title}</h1>
              <p className="mt-3 text-sm leading-6 text-[#6e6e73]">
                {t.subtitle}
              </p>
            </div>

            <div className="rounded-[28px] border border-white/60 bg-white/70 p-5 shadow backdrop-blur-xl">
              <div className="space-y-5">

                <input
                  type="date"
                  onChange={e => setBirthDate(e.target.value)}
                  className="w-full rounded-2xl border px-4 py-3"
                />

                <input
                  placeholder={t.birthTime}
                  onChange={e => setBirthTime(e.target.value)}
                  className="w-full rounded-2xl border px-4 py-3 placeholder:text-gray-400"
                />

                <textarea
                  placeholder={t.background}
                  onChange={e => setBackground(e.target.value)}
                  className="min-h-[140px] w-full rounded-2xl border px-4 py-3 placeholder:text-gray-400"
                />

                <textarea
                  placeholder={t.recent}
                  onChange={e => setRecent(e.target.value)}
                  className="min-h-[140px] w-full rounded-2xl border px-4 py-3 placeholder:text-gray-400"
                />

                <button
                  onClick={handleSubmit}
                  className="w-full rounded-2xl bg-black py-3 text-white"
                >
                  {t.submit}
                </button>

              </div>
            </div>
          </>
        )}

        {step === 'result' && (
          <div className="whitespace-pre-wrap text-[15px] leading-8">
            {result || t.loading}
          </div>
        )}

      </div>
    </div>
  )
}