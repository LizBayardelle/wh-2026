import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "dropdown", "pills", "hidden"]

  connect() {
    this.selected = []
    this.allStashes = []
    this.highlightIndex = -1
    this.fetchStashes()
  }

  async fetchStashes() {
    try {
      const resp = await fetch("/stashes")
      this.allStashes = await resp.json()
    } catch(e) {
      this.allStashes = []
    }
  }

  onInput() {
    const q = this.inputTarget.value.trim().toLowerCase()
    if (q.length === 0) {
      this.hideDropdown()
      return
    }

    const selectedNames = this.selected.map(s => s.name.toLowerCase())
    const matches = this.allStashes.filter(s =>
      s.name.toLowerCase().includes(q) && !selectedNames.includes(s.name.toLowerCase())
    ).slice(0, 5)

    const exactMatch = this.allStashes.some(s => s.name.toLowerCase() === q)
    this.highlightIndex = -1
    this.renderDropdown(matches, q, exactMatch)
  }

  onKeydown(event) {
    const items = this.dropdownTarget.querySelectorAll("[data-stash-item]")

    if (event.key === "ArrowDown") {
      event.preventDefault()
      this.highlightIndex = Math.min(this.highlightIndex + 1, items.length - 1)
      this.updateHighlight(items)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      this.highlightIndex = Math.max(this.highlightIndex - 1, -1)
      this.updateHighlight(items)
    } else if (event.key === "Enter") {
      event.preventDefault()
      if (this.highlightIndex >= 0 && items[this.highlightIndex]) {
        items[this.highlightIndex].click()
      } else if (this.inputTarget.value.trim()) {
        this.addNew(this.inputTarget.value.trim())
      }
    }
  }

  renderDropdown(matches, query, exactMatch) {
    if (matches.length === 0 && exactMatch) {
      this.hideDropdown()
      return
    }

    let html = ""
    matches.forEach((s, i) => {
      const highlighted = s.name.replace(
        new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, "gi"),
        '<span class="font-medium text-slate-700">$1</span>'
      )
      html += `<button type="button" data-stash-item data-stash-name="${this.escapeHtml(s.name)}" data-stash-id="${s.id}" data-stash-color="${s.color}" data-action="click->stash-input#selectExisting" class="w-full text-left px-3 py-2 text-sm font-light text-slate-500 hover:bg-brand-50 hover:text-brand-600 transition-colors flex items-center gap-2"><i class="fa-solid fa-box-archive text-[9px] text-slate-300"></i><span>${highlighted}</span></button>`
    })

    if (!exactMatch && query.length > 0) {
      html += `<button type="button" data-stash-item data-stash-name="${this.escapeHtml(this.inputTarget.value.trim())}" data-action="click->stash-input#createNew" class="w-full text-left px-3 py-2 text-sm font-light text-brand-500 hover:bg-brand-50 transition-colors flex items-center gap-2 border-t border-slate-100"><i class="fa-solid fa-plus text-[9px]"></i><span>Create "${this.escapeHtml(this.inputTarget.value.trim())}"</span></button>`
    }

    this.dropdownTarget.innerHTML = html
    this.dropdownTarget.classList.remove("hidden")
  }

  updateHighlight(items) {
    items.forEach((item, i) => {
      if (i === this.highlightIndex) {
        item.classList.add("bg-brand-50", "text-brand-600")
      } else {
        item.classList.remove("bg-brand-50", "text-brand-600")
      }
    })
  }

  selectExisting(event) {
    const btn = event.currentTarget
    this.addStash({ name: btn.dataset.stashName, id: btn.dataset.stashId, color: btn.dataset.stashColor })
  }

  createNew(event) {
    const btn = event.currentTarget
    this.addNew(btn.dataset.stashName)
  }

  addNew(name) {
    if (this.selected.some(s => s.name.toLowerCase() === name.toLowerCase())) return
    this.addStash({ name: name, id: null, color: "brand" })
  }

  addStash(stash) {
    if (this.selected.some(s => s.name.toLowerCase() === stash.name.toLowerCase())) return
    this.selected.push(stash)
    this.inputTarget.value = ""
    this.hideDropdown()
    this.renderPills()
    this.syncHidden()
  }

  removeByIndex(index) {
    this.selected.splice(index, 1)
    this.renderPills()
    this.syncHidden()
  }

  removePill(event) {
    const index = parseInt(event.currentTarget.dataset.index)
    this.removeByIndex(index)
  }

  renderPills() {
    let html = ""
    this.selected.forEach((s, i) => {
      html += `<span class="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-0.5 rounded-full bg-brand-50 text-brand-600 text-[11px] font-light">
                 <i class="fa-solid fa-box-archive text-[8px] opacity-50"></i>
                 ${this.escapeHtml(s.name)}
                 <button type="button" data-action="click->stash-input#removePill" data-index="${i}"
                   class="ml-0.5 w-4 h-4 rounded-full flex items-center justify-center hover:bg-brand-100 transition-colors">
                   <i class="fa-solid fa-xmark text-[8px]"></i>
                 </button>
               </span>`
    })
    this.pillsTarget.innerHTML = html
  }

  syncHidden() {
    this.hiddenTarget.value = this.selected.map(s => s.name).join(",")
  }

  hideDropdown() {
    this.dropdownTarget.classList.add("hidden")
  }

  onBlur() {
    setTimeout(() => this.hideDropdown(), 150)
  }

  // Called externally to set stashes when editing
  setStashes(stashes) {
    this.selected = stashes || []
    this.renderPills()
    this.syncHidden()
  }

  clear() {
    this.selected = []
    this.renderPills()
    this.syncHidden()
  }

  escapeHtml(str) {
    const div = document.createElement("div")
    div.textContent = str
    return div.innerHTML
  }
}
