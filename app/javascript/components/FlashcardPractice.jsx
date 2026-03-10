import React, { useState, useEffect, useCallback, useRef } from "react"

const PROMPT_MODES = [
  { key: "translation", label: "English", icon: "fa-solid fa-language", desc: "See the English meaning, recall the word" },
  { key: "term", label: "Foreign word", icon: "fa-solid fa-globe", desc: "See the word, recall the meaning" },
  { key: "romanization", label: "Romanization", icon: "fa-solid fa-spell-check", desc: "See the romanization, recall the word" },
  { key: "pronunciation", label: "Pronunciation", icon: "fa-solid fa-volume-high", desc: "See the pronunciation, recall the word" },
]

// ---------------------------------------------------------------------------
// Setup screen — pick what shows on the front of the card
// ---------------------------------------------------------------------------
function SetupScreen({ session, words, onStart, onBack }) {
  // Filter out modes where no words have that field
  const availableModes = PROMPT_MODES.filter(mode => {
    if (mode.key === "translation" || mode.key === "term") return true
    return words.some(w => w[mode.key])
  })

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
      <div className="w-full max-w-sm">
        <button onClick={onBack} className="mb-8 text-slate-400 hover:text-slate-600 transition-colors">
          <i className="fa-solid fa-arrow-left text-sm" />
        </button>

        <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-brand-400 mb-2">{session.label}</p>
        <h1 className="text-2xl sm:text-3xl font-extralight tracking-tight text-slate-900 mb-1">What do you want to see?</h1>
        <p className="text-sm font-extralight text-slate-400 mb-8">Pick what shows on the front of each card.</p>

        <div className="space-y-2">
          {availableModes.map(mode => (
            <button
              key={mode.key}
              onClick={() => onStart(mode.key)}
              className="w-full text-left px-4 py-4 bg-white rounded-xl border border-slate-100 hover:border-brand-200 hover:shadow-sm transition-all group flex items-center gap-4 active:scale-[0.98]"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-brand-50 transition-colors shrink-0">
                <i className={`${mode.icon} text-sm text-slate-400 group-hover:text-brand-400 transition-colors`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-light text-slate-800">{mode.label}</p>
                <p className="text-[11px] font-extralight text-slate-400">{mode.desc}</p>
              </div>
              <i className="fa-solid fa-chevron-right text-[10px] text-slate-300 group-hover:text-brand-400 transition-colors" />
            </button>
          ))}
        </div>

        <p className="mt-6 text-center text-[10px] font-light text-slate-300">
          {words.length} card{words.length === 1 ? "" : "s"} in this deck
        </p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Progress bar
// ---------------------------------------------------------------------------
function ProgressBar({ correct, total }) {
  const pct = total > 0 ? (correct / total) * 100 : 0
  return (
    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Flashcard — front shows only the prompt field, back shows everything
// ---------------------------------------------------------------------------
function Card({ word, flipped, onFlip, promptMode }) {
  const promptValue = word[promptMode] || ""
  const promptLabel = PROMPT_MODES.find(m => m.key === promptMode)?.label || ""

  return (
    <button
      type="button"
      onClick={!flipped ? onFlip : undefined}
      className={`relative w-full rounded-2xl border transition-all duration-300 select-none text-center
        ${!flipped ? "cursor-pointer" : "cursor-default"}
        ${flipped ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50/50 hover:border-brand-200 hover:shadow-md active:scale-[0.98]"}`}
    >
      {!flipped ? (
        /* ---- FRONT ---- */
        <div className="flex flex-col items-center justify-center px-6 py-14 sm:py-16">
          <p className="text-[10px] font-medium tracking-wider uppercase text-slate-300 mb-5">{promptLabel}</p>
          <p className="text-2xl sm:text-3xl font-light text-slate-900 break-words">{promptValue}</p>
          <p className="absolute bottom-4 text-[10px] font-light text-slate-300">
            tap to reveal
          </p>
        </div>
      ) : (
        /* ---- BACK ---- */
        <div className="flex flex-col items-center justify-center px-6 py-10 sm:py-12">
          {/* The big answer — show the "other side" prominently */}
          {promptMode !== "term" && (
            <p className="text-2xl sm:text-3xl font-light text-slate-900 mb-1">{word.term}</p>
          )}
          {promptMode !== "translation" && (
            <p className={`${promptMode === "term" ? "text-2xl sm:text-3xl" : "text-lg"} font-light text-slate-900 mb-1`}>{word.translation}</p>
          )}

          {/* Supporting details */}
          <div className="mt-3 space-y-1">
            {promptMode !== "romanization" && word.romanization && (
              <p className="text-sm font-light text-slate-400">{word.romanization}</p>
            )}
            {promptMode !== "pronunciation" && word.pronunciation && (
              <p className="text-sm font-light text-slate-400">{word.pronunciation}</p>
            )}
          </div>

          {word.alternativeTranslations && (
            <p className="text-xs font-extralight text-slate-400 mt-2">{word.alternativeTranslations}</p>
          )}

          {word.partOfSpeech && (
            <span className="mt-3 px-2.5 py-0.5 rounded-full bg-slate-100 text-[10px] font-light text-slate-400">
              {word.partOfSpeech}
            </span>
          )}

          {word.exampleSentence && (
            <div className="mt-5 pt-4 border-t border-slate-100 w-full">
              <p className="text-xs font-light text-slate-500 italic">{word.exampleSentence}</p>
              {word.exampleTranslation && (
                <p className="text-[10px] font-light text-slate-400 mt-1">{word.exampleTranslation}</p>
              )}
            </div>
          )}
        </div>
      )}
    </button>
  )
}

// ---------------------------------------------------------------------------
// Results screen
// ---------------------------------------------------------------------------
function ResultsScreen({ session, onRestart, onBack }) {
  const firstTryPct = session.wordsSeen > 0 ? Math.round((session.correctCount / session.wordsSeen) * 100) : 0
  const sessionPct = session.totalWords > 0 ? Math.round((session.masteredCount / session.totalWords) * 100) : 100
  const bestPct = Math.max(firstTryPct, sessionPct)
  const icon = bestPct >= 80 ? "fa-trophy" : bestPct >= 50 ? "fa-star" : "fa-rotate"
  const iconColor = bestPct >= 80 ? "text-xp-green" : bestPct >= 50 ? "text-reward-400" : "text-red-400"
  const bgColor = bestPct >= 80 ? "bg-xp-green-light" : bestPct >= 50 ? "bg-reward-50" : "bg-red-50"
  const headline = bestPct >= 80 ? "Legendary!" : bestPct >= 50 ? "Nice work!" : "Keep going!"

  function accColor(pct) {
    if (pct >= 80) return "text-xp-green"
    if (pct >= 50) return "text-reward-500"
    return "text-red-400"
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
      <div className={`w-16 h-16 sm:w-20 sm:h-20 mb-5 sm:mb-6 rounded-2xl flex items-center justify-center ${bgColor}`}>
        <i className={`fa-solid ${icon} text-2xl sm:text-3xl ${iconColor}`} />
      </div>
      <h1 className="text-2xl sm:text-3xl font-extralight tracking-tight text-slate-900 mb-2">{headline}</h1>
      <p className="text-sm font-extralight text-slate-400 mb-8">{session.label}</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10 w-full max-w-xs sm:max-w-md">
        <div className="bg-slate-50/50 rounded-xl py-3 sm:py-4 text-center">
          <p className={`text-xl sm:text-2xl font-extralight ${accColor(firstTryPct)}`}>{firstTryPct}%</p>
          <p className="text-[9px] sm:text-[10px] font-medium tracking-wider uppercase text-slate-300 mt-1">First Try</p>
        </div>
        <div className="bg-slate-50/50 rounded-xl py-3 sm:py-4 text-center">
          <p className={`text-xl sm:text-2xl font-extralight ${accColor(sessionPct)}`}>{sessionPct}%</p>
          <p className="text-[9px] sm:text-[10px] font-medium tracking-wider uppercase text-slate-300 mt-1">Session</p>
        </div>
        <div className="bg-slate-50/50 rounded-xl py-3 sm:py-4 text-center">
          <p className="text-xl sm:text-2xl font-extralight text-slate-900">{session.correctCount}/{session.wordsSeen}</p>
          <p className="text-[9px] sm:text-[10px] font-medium tracking-wider uppercase text-slate-300 mt-1">Words</p>
        </div>
        <div className="bg-slate-50/50 rounded-xl py-3 sm:py-4 text-center">
          <p className="text-xl sm:text-2xl font-extralight text-slate-900">
            {session.duration ? `${Math.floor(session.duration / 60)}:${String(session.duration % 60).padStart(2, "0")}` : "—"}
          </p>
          <p className="text-[9px] sm:text-[10px] font-medium tracking-wider uppercase text-slate-300 mt-1">Time</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={onBack}
          className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-white text-slate-600 text-sm font-light rounded-lg border border-slate-200 hover:border-slate-300 transition-all active:scale-[0.97]">
          <i className="fa-solid fa-arrow-left text-[10px] opacity-50" />
          Practice Homepage
        </button>
        <button onClick={onRestart}
          className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-light rounded-lg hover:shadow-md transition-all active:scale-[0.97]">
          <i className="fa-solid fa-rotate text-[10px] opacity-70" />
          Again
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function FlashcardPractice({ session: initialSession, words: initialWords, csrf, attemptsUrl, completeUrl, backUrl }) {
  const [phase, setPhase] = useState("setup") // setup | practice | results
  const [promptMode, setPromptMode] = useState(null)

  // Deck is a queue: words to show. Wrong answers get re-inserted later.
  const [deck, setDeck] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [session, setSession] = useState(initialSession)
  const [submitting, setSubmitting] = useState(false)
  const [attemptCounts, setAttemptCounts] = useState({}) // wordId -> number of attempts so far
  const cardRevealTime = useRef(null)

  const allWords = useRef(initialWords.filter(w => !w.attempted))

  const currentWord = deck[currentIndex]

  // Count unique correct words for progress
  const [correctWordIds, setCorrectWordIds] = useState(new Set())
  const totalUniqueWords = allWords.current.length

  function handleStart(mode) {
    // Filter: only include words that have the prompt field
    const eligible = allWords.current.filter(w => w[mode])
    if (eligible.length === 0) {
      // Fallback — shouldn't happen because we filter in setup, but just in case
      setDeck(allWords.current)
    } else {
      setDeck([...eligible])
    }
    setPromptMode(mode)
    setCurrentIndex(0)
    setFlipped(false)
    setAttemptCounts({})
    setCorrectWordIds(new Set())
    setPhase("practice")
  }

  const postAttempt = useCallback(async (wordId, correct, attemptNum) => {
    const responseTime = cardRevealTime.current ? Date.now() - cardRevealTime.current : null
    try {
      const res = await fetch(attemptsUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-CSRF-Token": csrf },
        body: JSON.stringify({
          word_id: wordId,
          correct,
          attempt_number: attemptNum,
          response_time_ms: responseTime
        })
      })
      const data = await res.json()
      setSession(prev => ({
        ...prev,
        wordsSeen: data.wordsSeen,
        correctCount: data.correctCount,
        incorrectCount: data.incorrectCount,
      }))
    } catch (e) {
      console.error("Failed to save attempt", e)
    }
  }, [attemptsUrl, csrf])

  const handleFlip = useCallback(() => {
    setFlipped(true)
    cardRevealTime.current = Date.now()
  }, [])

  const advance = useCallback(() => {
    setCurrentIndex(prev => prev + 1)
    setFlipped(false)
    cardRevealTime.current = null
  }, [])

  const finishSession = useCallback(async (masteredCount) => {
    try {
      const res = await fetch(completeUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "X-CSRF-Token": csrf }
      })
      const data = await res.json()
      setSession(prev => ({
        ...prev,
        duration: data.duration,
        masteredCount: masteredCount,
        totalWords: totalUniqueWords
      }))
    } catch (e) {
      console.error("Failed to complete session", e)
    }
    setPhase("results")
  }, [completeUrl, csrf, totalUniqueWords])

  const handleAnswer = useCallback(async (correct) => {
    if (submitting || !currentWord) return
    setSubmitting(true)

    const wordId = currentWord.id
    const prevCount = attemptCounts[wordId] || 0
    const attemptNum = prevCount + 1

    setAttemptCounts(prev => ({ ...prev, [wordId]: attemptNum }))

    await postAttempt(wordId, correct, attemptNum)

    if (correct) {
      setCorrectWordIds(prev => {
        const next = new Set(prev)
        next.add(wordId)
        return next
      })
    }

    if (!correct) {
      // Re-insert this word later in the deck (3–5 cards ahead, or at end)
      setDeck(prev => {
        const next = [...prev]
        const insertAt = Math.min(currentIndex + 3 + Math.floor(Math.random() * 3), next.length)
        next.splice(insertAt, 0, currentWord)
        return next
      })
    }

    // Check if this was the last card in deck
    const newMasteredCount = correct ? correctWordIds.size + (correctWordIds.has(wordId) ? 0 : 1) : correctWordIds.size
    const isLast = currentIndex >= deck.length - 1 && correct
    if (isLast) {
      await finishSession(newMasteredCount)
    } else {
      advance()
    }

    setSubmitting(false)
  }, [submitting, currentWord, currentIndex, deck.length, attemptCounts, postAttempt, advance, finishSession])

  // Keyboard shortcuts — only during practice phase
  useEffect(() => {
    if (phase !== "practice") return
    function onKey(e) {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault()
        if (!flipped) handleFlip()
      }
      if (flipped && !submitting) {
        if (e.key === "ArrowRight" || e.key === "j") handleAnswer(true)
        if (e.key === "ArrowLeft" || e.key === "f") handleAnswer(false)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [phase, flipped, submitting, handleFlip, handleAnswer])

  // ---------------------------------------------------------------------------
  // Render phases
  // ---------------------------------------------------------------------------

  if (allWords.current.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        <p className="text-lg font-extralight text-slate-500 mb-4">No words to practice</p>
        <a href={backUrl} className="text-sm font-light text-brand-500 hover:text-brand-600">Back to Practice</a>
      </div>
    )
  }

  if (phase === "setup") {
    return (
      <SetupScreen
        session={initialSession}
        words={allWords.current}
        onStart={handleStart}
        onBack={() => window.location.href = backUrl}
      />
    )
  }

  if (phase === "results") {
    return (
      <ResultsScreen
        session={session}
        onRestart={() => { setPhase("setup"); setCurrentIndex(0); setFlipped(false) }}
        onBack={() => window.location.href = backUrl}
      />
    )
  }

  // phase === "practice"
  if (!currentWord) return null

  return (
    <div className="flex flex-col min-h-screen min-h-[100dvh]">
      {/* Header — compact on mobile */}
      <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 safe-top">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <a href={backUrl} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors -ml-1">
              <i className="fa-solid fa-xmark text-sm" />
            </a>
            <p className="text-[11px] font-light text-slate-400">
              <span className="text-slate-600 font-normal">{correctWordIds.size}</span> / {totalUniqueWords}
            </p>
            <div className="flex items-center gap-2.5 text-[11px] font-light">
              <span className="text-xp-green">{session.correctCount} <i className="fa-solid fa-check text-[8px]" /></span>
              <span className="text-red-400">{session.incorrectCount} <i className="fa-solid fa-xmark text-[8px]" /></span>
            </div>
          </div>
          <ProgressBar correct={correctWordIds.size} total={totalUniqueWords} />
        </div>
      </div>

      {/* Card area — fills available space, centered */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 pb-4">
        <div className="w-full max-w-md">
          <Card word={currentWord} flipped={flipped} onFlip={handleFlip} promptMode={promptMode} />

          {/* Answer buttons — big touch targets on mobile */}
          <div className={`mt-5 sm:mt-6 transition-opacity duration-200 ${flipped ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <div className="flex items-stretch gap-3">
              <button
                onClick={() => handleAnswer(false)}
                disabled={submitting || !flipped}
                className="flex-1 py-4 sm:py-3 rounded-xl border border-red-200 bg-red-50/50 text-red-400 text-sm font-light hover:bg-red-50 hover:border-red-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.97]"
              >
                <i className="fa-solid fa-xmark text-xs" />
                Missed it
              </button>
              <button
                onClick={() => handleAnswer(true)}
                disabled={submitting || !flipped}
                className="flex-1 py-4 sm:py-3 rounded-xl border border-xp-green/30 bg-xp-green-light/50 text-xp-green text-sm font-light hover:bg-xp-green-light hover:border-xp-green/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.97]"
              >
                <i className="fa-solid fa-check text-xs" />
                Got it
              </button>
            </div>
          </div>

          {/* Keyboard hints — desktop only */}
          <div className="hidden sm:block mt-5 text-center">
            {!flipped ? (
              <p className="text-[10px] font-light text-slate-300">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 text-slate-400 font-mono text-[9px]">space</span> to flip
              </p>
            ) : (
              <p className="text-[10px] font-light text-slate-300">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 text-slate-400 font-mono text-[9px]">&larr;</span> missed
                <span className="mx-2 text-slate-200">&middot;</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 text-slate-400 font-mono text-[9px]">&rarr;</span> got it
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
