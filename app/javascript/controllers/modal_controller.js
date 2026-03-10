import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["overlay"]

  open() {
    this.overlayTarget.classList.remove("hidden")
    document.body.classList.add("overflow-hidden")
    requestAnimationFrame(() => {
      this.overlayTarget.querySelector("[data-modal-panel]")?.classList.remove("opacity-0", "scale-95")
      this.overlayTarget.querySelector("[data-modal-panel]")?.classList.add("opacity-100", "scale-100")
      this.overlayTarget.classList.remove("opacity-0")
      this.overlayTarget.classList.add("opacity-100")
    })
  }

  close() {
    const panel = this.overlayTarget.querySelector("[data-modal-panel]")
    panel?.classList.remove("opacity-100", "scale-100")
    panel?.classList.add("opacity-0", "scale-95")
    this.overlayTarget.classList.remove("opacity-100")
    this.overlayTarget.classList.add("opacity-0")
    setTimeout(() => {
      this.overlayTarget.classList.add("hidden")
      document.body.classList.remove("overflow-hidden")
    }, 200)
  }

  backdropClose(event) {
    if (event.target === this.overlayTarget) {
      this.close()
    }
  }

  keydown(event) {
    if (event.key === "Escape") {
      this.close()
    }
  }
}
