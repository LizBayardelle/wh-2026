import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "overlay", "panel", "title", "form",
    "term", "romanization", "pronunciation", "translation",
    "alternativeTranslations", "partOfSpeech", "pitchAccent",
    "formality", "register", "gender", "plural",
    "exampleSentence", "exampleTranslation", "usageNotes",
    "notes", "source", "languageId", "methodField",
    "languageBadges", "stashNames", "details", "languageWarning"
  ]

  connect() {
    this.formTarget.addEventListener("submit", this.validateLanguage.bind(this))
  }

  validateLanguage(event) {
    if (this.hasLanguageIdTarget && !this.languageIdTarget.value) {
      event.preventDefault()
      if (this.hasLanguageWarningTarget) {
        this.languageWarningTarget.classList.remove("hidden")
        this.languageWarningTarget.classList.add("animate-pulse-subtle")
        setTimeout(() => this.languageWarningTarget.classList.remove("animate-pulse-subtle"), 600)
      }
    }
  }

  openNew() {
    this.titleTarget.textContent = "Add Word"
    this.formTarget.action = this.formTarget.dataset.createUrl
    this.methodFieldTarget.value = "post"
    this.clearFields()
    this.resetLanguageState()
    this.collapseDetails()
    this.show()
  }

  resetLanguageState() {
    if (!this.hasLanguageIdTarget) return
    const initialValue = this.languageIdTarget.dataset.initialValue
    this.languageIdTarget.value = initialValue || ""
    this.updateLanguageBadges(initialValue || null)
    if (this.hasLanguageWarningTarget) this.languageWarningTarget.classList.add("hidden")
  }

  openEdit(event) {
    const btn = event.currentTarget
    this.titleTarget.textContent = "Edit Word"
    this.formTarget.action = btn.dataset.url
    this.methodFieldTarget.value = "patch"

    this.termTarget.value = btn.dataset.term || ""
    this.romanizationTarget.value = btn.dataset.romanization || ""
    this.pronunciationTarget.value = btn.dataset.pronunciation || ""
    this.translationTarget.value = btn.dataset.translation || ""
    this.alternativeTranslationsTarget.value = btn.dataset.alternativeTranslations || ""
    this.partOfSpeechTarget.value = btn.dataset.partOfSpeech || ""
    this.pitchAccentTarget.value = btn.dataset.pitchAccent || ""
    this.formalityTarget.value = btn.dataset.formality || ""
    this.registerTarget.value = btn.dataset.register || ""
    this.genderTarget.value = btn.dataset.gender || ""
    this.pluralTarget.value = btn.dataset.plural || ""
    this.exampleSentenceTarget.value = btn.dataset.exampleSentence || ""
    this.exampleTranslationTarget.value = btn.dataset.exampleTranslation || ""
    this.usageNotesTarget.value = btn.dataset.usageNotes || ""
    this.notesTarget.value = btn.dataset.notes || ""
    this.sourceTarget.value = btn.dataset.source || ""

    if (this.hasLanguageIdTarget) {
      this.languageIdTarget.value = btn.dataset.languageId || ""
      this.updateLanguageBadges(btn.dataset.languageId)
    }

    // Load stashes
    const stashData = btn.dataset.stashes
    if (stashData && this.hasStashNamesTarget) {
      try {
        const stashes = JSON.parse(stashData)
        const stashController = this.stashNamesTarget.closest("[data-controller='stash-input']")
        if (stashController) {
          const ctrl = this.application.getControllerForElementAndIdentifier(stashController, "stash-input")
          if (ctrl) ctrl.setStashes(stashes)
        }
        this.stashNamesTarget.value = stashes.map(s => s.name).join(",")
      } catch(e) {}
    }

    // Open details if any detail fields are filled
    const hasDetails = btn.dataset.pitchAccent || btn.dataset.plural ||
      btn.dataset.alternativeTranslations ||
      btn.dataset.exampleSentence || btn.dataset.exampleTranslation ||
      btn.dataset.usageNotes || btn.dataset.notes || btn.dataset.source
    if (hasDetails) {
      this.expandDetails()
    } else {
      this.collapseDetails()
    }

    this.show()
  }

  selectLanguage(event) {
    event.preventDefault()
    const langId = event.currentTarget.dataset.langId
    this.languageIdTarget.value = langId
    this.updateLanguageBadges(langId)
    if (this.hasLanguageWarningTarget) {
      this.languageWarningTarget.classList.add("hidden")
    }
  }

  updateLanguageBadges(activeLangId) {
    if (!this.hasLanguageBadgesTarget) return
    const badges = this.languageBadgesTarget.querySelectorAll("button")
    badges.forEach(badge => {
      const isActive = badge.dataset.langId === String(activeLangId)
      badge.classList.toggle("bg-brand-500", isActive)
      badge.classList.toggle("text-white", isActive)
      badge.classList.toggle("shadow-sm", isActive)
      badge.classList.toggle("bg-slate-50", !isActive)
      badge.classList.toggle("text-slate-400", !isActive)
      badge.classList.toggle("hover:bg-slate-100", !isActive)
      badge.classList.toggle("hover:text-slate-600", !isActive)
    })
  }

  clearFields() {
    const fields = [
      "term", "romanization", "pronunciation", "translation",
      "alternativeTranslations", "partOfSpeech", "pitchAccent",
      "formality", "register", "gender", "plural",
      "exampleSentence", "exampleTranslation", "usageNotes",
      "notes", "source"
    ]
    fields.forEach(f => {
      const target = `${f}Target`
      const hasCheck = `has${f.charAt(0).toUpperCase() + f.slice(1)}Target`
      if (this[hasCheck]) {
        this[target].value = ""
      }
    })

    // Clear stashes
    if (this.hasStashNamesTarget) {
      this.stashNamesTarget.value = ""
      const stashController = this.stashNamesTarget.closest("[data-controller='stash-input']")
      if (stashController) {
        const ctrl = this.application.getControllerForElementAndIdentifier(stashController, "stash-input")
        if (ctrl) ctrl.clear()
      }
    }
  }

  collapseDetails() {
    if (this.hasDetailsTarget) this.detailsTarget.removeAttribute("open")
  }

  expandDetails() {
    if (this.hasDetailsTarget) this.detailsTarget.setAttribute("open", "")
  }

  show() {
    this.overlayTarget.classList.remove("hidden")
    document.body.classList.add("overflow-hidden")
    requestAnimationFrame(() => {
      this.panelTarget.classList.remove("opacity-0", "scale-95")
      this.panelTarget.classList.add("opacity-100", "scale-100")
      this.overlayTarget.classList.remove("opacity-0")
      this.overlayTarget.classList.add("opacity-100")
    })
    setTimeout(() => this.translationTarget.focus(), 250)
  }

  close() {
    this.panelTarget.classList.remove("opacity-100", "scale-100")
    this.panelTarget.classList.add("opacity-0", "scale-95")
    this.overlayTarget.classList.remove("opacity-100")
    this.overlayTarget.classList.add("opacity-0")
    setTimeout(() => {
      this.overlayTarget.classList.add("hidden")
      document.body.classList.remove("overflow-hidden")
    }, 200)
  }

  backdropClose(event) {
    // Close if clicking the overlay itself or the centering wrapper, but not the panel
    if (event.target === this.overlayTarget || (!this.panelTarget.contains(event.target) && event.target !== this.panelTarget)) {
      this.close()
    }
  }

  keydown(event) {
    if (event.key === "Escape") {
      this.close()
    }
  }
}
