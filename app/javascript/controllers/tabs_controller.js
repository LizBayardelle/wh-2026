import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["tab", "panel"]
  static values = { urlParam: { type: String, default: "" } }

  switch(event) {
    const id = event.currentTarget.dataset.tabId

    this.tabTargets.forEach(tab => {
      if (tab.dataset.tabId === id) {
        tab.classList.add("text-slate-900", "border-brand-500")
        tab.classList.remove("text-slate-400", "border-transparent")
      } else {
        tab.classList.remove("text-slate-900", "border-brand-500")
        tab.classList.add("text-slate-400", "border-transparent")
      }
    })

    this.panelTargets.forEach(panel => {
      panel.classList.toggle("hidden", panel.dataset.tabId !== id)
    })

    // Update URL if urlParam is set
    if (this.urlParamValue) {
      const url = new URL(window.location)
      if (id === "all") {
        url.searchParams.delete(this.urlParamValue)
      } else {
        url.searchParams.set(this.urlParamValue, id)
      }
      // Reset pagination when switching tabs
      url.searchParams.delete("page")
      window.location = url.toString()
    }
  }
}
