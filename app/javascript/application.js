// Entry point for the build script in your package.json
import "./controllers"

// React components
import React from "react"
import { createRoot } from "react-dom/client"
import FlashcardPractice from "./components/FlashcardPractice"

document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("practice-root")
  if (el) {
    const session = JSON.parse(el.dataset.session)
    const words = JSON.parse(el.dataset.words)
    const csrf = el.dataset.csrf
    const attemptsUrl = el.dataset.attemptsUrl
    const completeUrl = el.dataset.completeUrl
    const backUrl = el.dataset.backUrl

    createRoot(el).render(
      React.createElement(FlashcardPractice, {
        session, words, csrf, attemptsUrl, completeUrl, backUrl
      })
    )
  }
})
