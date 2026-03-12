import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["panel", "icon", "button"]

  toggle() {
    this.panelTarget.classList.toggle("hidden")
    const isOpen = !this.panelTarget.classList.contains("hidden")
    this.iconTarget.classList.toggle("fa-bars", !isOpen)
    this.iconTarget.classList.toggle("fa-xmark", isOpen)
  }

  close() {
    this.panelTarget.classList.add("hidden")
    this.iconTarget.classList.add("fa-bars")
    this.iconTarget.classList.remove("fa-xmark")
  }
}
