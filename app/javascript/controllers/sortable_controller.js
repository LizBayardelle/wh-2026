import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["item"]
  static values = { url: String }

  connect() {
    this.dragItem = null
    this.placeholder = null
  }

  dragstart(event) {
    this.dragItem = event.currentTarget
    this.dragItem.classList.add("opacity-50")
    event.dataTransfer.effectAllowed = "move"
    event.dataTransfer.setData("text/plain", "")
  }

  dragover(event) {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"

    const target = event.currentTarget
    if (target === this.dragItem) return

    const rect = target.getBoundingClientRect()
    const midY = rect.top + rect.height / 2

    if (event.clientY < midY) {
      target.parentNode.insertBefore(this.dragItem, target)
    } else {
      target.parentNode.insertBefore(this.dragItem, target.nextSibling)
    }
  }

  dragend(event) {
    this.dragItem.classList.remove("opacity-50")
    this.dragItem = null
    this.save()
  }

  save() {
    const ids = this.itemTargets.map(el => el.dataset.languageId)

    fetch(this.urlValue, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content
      },
      body: JSON.stringify({ language_ids: ids })
    })
  }
}
