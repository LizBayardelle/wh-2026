import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["search", "item", "langFilter", "showMore", "counter"]
  static values = { pageSize: { type: Number, default: 8 } }

  connect() {
    this.activeLang = null
    this.visibleCount = this.pageSizeValue
    this.filter()
  }

  onSearch() {
    this.visibleCount = this.pageSizeValue
    this.filter()
  }

  toggleLang(event) {
    const langId = event.currentTarget.dataset.langId
    if (this.activeLang === langId) {
      this.activeLang = null
    } else {
      this.activeLang = langId
    }
    this.langFilterTargets.forEach(btn => {
      const active = btn.dataset.langId === this.activeLang
      btn.classList.toggle("bg-brand-500", active)
      btn.classList.toggle("text-white", active)
      btn.classList.toggle("shadow-sm", active)
      btn.classList.toggle("bg-slate-50", !active)
      btn.classList.toggle("text-slate-500", !active)
      btn.classList.toggle("hover:bg-slate-100", !active)
    })
    this.visibleCount = this.pageSizeValue
    this.filter()
  }

  showMoreItems() {
    this.visibleCount += this.pageSizeValue
    this.filter()
  }

  filter() {
    const query = (this.searchTarget.value || "").trim().toLowerCase()
    let matchCount = 0
    let shownCount = 0

    this.itemTargets.forEach(item => {
      const name = (item.dataset.name || "").toLowerCase()
      const langs = (item.dataset.langs || "").split(",")

      const matchesQuery = !query || name.includes(query)
      const matchesLang = !this.activeLang || langs.includes(this.activeLang)

      if (matchesQuery && matchesLang) {
        matchCount++
        if (matchCount <= this.visibleCount) {
          item.classList.remove("hidden")
          shownCount++
        } else {
          item.classList.add("hidden")
        }
      } else {
        item.classList.add("hidden")
      }
    })

    if (this.hasShowMoreTarget) {
      if (shownCount < matchCount) {
        this.showMoreTarget.classList.remove("hidden")
        this.showMoreTarget.querySelector("[data-remaining]").textContent = matchCount - shownCount
      } else {
        this.showMoreTarget.classList.add("hidden")
      }
    }

    if (this.hasCounterTarget) {
      this.counterTarget.textContent = `${matchCount} stash${matchCount === 1 ? "" : "es"}`
    }
  }
}
