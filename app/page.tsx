'use client'

import { useState } from 'react'

export default function Home() {
  const [step, setStep] = useState<'input' | 'loading' | 'result'>('input')

  const [birthDate, setBirthDate] = useState('')
  const [birthTime, setBirthTime] = useState('')
  const [background, setBackground] = useState('')
  const [recent, setRecent] = useState('')
  const [result, setResult] = useState('')

  const handleSubmit = async () => {
    setStep('loading')

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthDate,
          birthTime,
          background,
          recent
        })
      })

      const data = await res.json()
      setResult(data.result || '暂时没有生成结果')
      setStep('result')
    } catch (error) {
      setResult('出错了，请稍后再试。')
      setStep('result')
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#111111] relative overflow-hidden">
      {/* 背景柔光 */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-white/70 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#e9eefc] blur-3xl" />
      </div>

      {/* 左上角署名 */}
      <div className="absolute top-5 left-5 text-[11px] tracking-[0.18em] text-[#9a9aa1]">
        早春花菜沙拉
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-xl flex-col px-6 py-16">
        {step === 'input' && (
          <>
            <div className="mb-12 text-center">
              <h1 className="text-[30px] font-medium tracking-tight text-[#111111]">
                人生轨迹推演
              </h1>
              <p className="mt-3 text-sm leading-6 text-[#6e6e73]">
                输入你的信息，查看接下来的人生走势与建议
              </p>
            </div>

            <div className="rounded-[28px] border border-white/60 bg-white/70 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl">
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1d1d1f]">
                    出生日期
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full rounded-2xl border border-[#e5e5ea] bg-[#fafafc] px-4 py-3 text-[15px] text-[#111111] outline-none transition focus:border-[#c7c7cc] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1d1d1f]">
                    出生时间（可选）
                  </label>
                  <input
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    placeholder="如果不知道出生时间，可不输入"
                    className="w-full rounded-2xl border border-[#e5e5ea] bg-[#fafafc] px-4 py-3 text-[15px] text-[#111111] outline-none transition placeholder:text-[#a1a1aa] focus:border-[#c7c7cc] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1d1d1f]">
                    个人背景
                  </label>
                  <textarea
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    placeholder="例如你的成长环境、家庭背景、出生地、MBTI、性格特点、擅长和不擅长的事、目前所处的人生阶段、正在做的工作或学习方向、你一直在意的东西。越详细越好，这样推演会更贴近你真实的状态。"
                    className="min-h-[160px] w-full resize-none rounded-2xl border border-[#e5e5ea] bg-[#fafafc] px-4 py-3 text-[15px] leading-7 text-[#111111] outline-none transition placeholder:text-[#a1a1aa] focus:border-[#c7c7cc] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1d1d1f]">
                    最近经历
                  </label>
                  <textarea
                    value={recent}
                    onChange={(e) => setRecent(e.target.value)}
                    placeholder="例如最近发生的事情、让你纠结的变化、感情、人际、学业、事业、情绪起伏、生活节奏的变化、你最近最常反复想到的事。写得越具体，推演会越完整。"
                    className="min-h-[160px] w-full resize-none rounded-2xl border border-[#e5e5ea] bg-[#fafafc] px-4 py-3 text-[15px] leading-7 text-[#111111] outline-none transition placeholder:text-[#a1a1aa] focus:border-[#c7c7cc] focus:bg-white"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  className="mt-2 w-full rounded-2xl bg-[#111111] py-3.5 text-[15px] font-medium text-white transition active:scale-[0.985]"
                >
                  开始推演
                </button>
              </div>
            </div>

            <p className="mt-5 text-center text-[11px] leading-5 text-[#8e8e93]">
              本推演基于你的输入内容进行综合分析，结果仅供参考。
            </p>
          </>
        )}

        {step === 'loading' && (
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-sm rounded-[28px] border border-white/70 bg-white/75 px-8 py-10 text-center shadow-[0_10px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#f2f2f7]">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#c7c7cc] border-t-[#111111]" />
              </div>

              <p className="text-[20px] font-medium text-[#111111]">请稍后</p>
              <p className="mt-2 text-sm text-[#6e6e73]">
                等待命运女神降临……
              </p>
              <p className="mt-5 text-xs leading-6 text-[#8e8e93]">
                正在结合你的经历、人生轨迹与当下状态进行推演
              </p>
            </div>
          </div>
        )}

        {step === 'result' && (
          <>
            <div className="mb-6 flex items-center">
              <button
                onClick={() => setStep('input')}
                className="rounded-full bg-white/80 px-4 py-2 text-sm text-[#6e6e73] shadow-sm backdrop-blur active:scale-[0.98]"
              >
                ← 返回
              </button>
            </div>

            <div className="mb-5">
              <h2 className="text-[28px] font-medium tracking-tight text-[#111111]">
                推演结果
              </h2>
              <p className="mt-2 text-sm text-[#6e6e73]">
                你接下来的人生轨迹
              </p>
            </div>

            <div className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl">
              <div className="whitespace-pre-line text-[15px] leading-8 text-[#1d1d1f]">
                {result}
              </div>
            </div>

            <button
              onClick={() => setStep('input')}
              className="mt-6 w-full rounded-2xl bg-[#111111] py-3.5 text-[15px] font-medium text-white transition active:scale-[0.985]"
            >
              重新推演
            </button>
          </>
        )}
      </div>
    </div>
  )
}