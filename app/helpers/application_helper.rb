module ApplicationHelper
  # Maps ISO 639 language codes to ISO 3166 country codes for flag emoji
  LANG_TO_FLAG = {
    "ar" => "SA", "bn" => "BD", "yue" => "HK", "cs" => "CZ",
    "da" => "DK", "nl" => "NL", "en" => "GB", "fi" => "FI",
    "fr" => "FR", "de" => "DE", "el" => "GR", "he" => "IL",
    "hi" => "IN", "hu" => "HU", "id" => "ID", "ga" => "IE",
    "it" => "IT", "ja" => "JP", "ko" => "KR", "la" => "VA",
    "zh" => "CN", "no" => "NO", "fa" => "IR", "pl" => "PL",
    "pt" => "BR", "ro" => "RO", "ru" => "RU", "gd" => "GB",
    "es" => "ES", "sw" => "KE", "sv" => "SE", "tl" => "PH",
    "th" => "TH", "tr" => "TR", "uk" => "UA", "ur" => "PK",
    "vi" => "VN", "cy" => "GB"
  }.freeze

  def flag_emoji(language)
    code = language.respond_to?(:code) ? language.code : language.to_s
    country = LANG_TO_FLAG[code]
    return "🏳️" unless country
    country.chars.map { |c| (c.ord + 0x1F1A5).chr("UTF-8") }.join
  end

  def session_flag(session)
    if session.language
      flag_emoji(session.language)
    elsif session.stash
      langs = session.stash.words.joins(:language).distinct.pluck("languages.code")
      if langs.size == 1
        flag_emoji(langs.first)
      elsif langs.size > 1
        langs.first(3).map { |c| flag_emoji(c) }.join("")
      else
        "🏳️"
      end
    else
      "🏳️"
    end
  end

  def sort_link(label, column, current_sort, current_dir, extra_params = {})
    is_active = current_sort == column
    next_dir = is_active && current_dir == "asc" ? "desc" : "asc"
    arrow = if is_active
      current_dir == "asc" ? "fa-arrow-up" : "fa-arrow-down"
    else
      ""
    end

    params_hash = request.query_parameters.merge(sort: column, dir: next_dir, page: 1).merge(extra_params)
    link_to words_path(params_hash),
      class: "inline-flex items-center gap-1 text-[10px] font-medium tracking-wider uppercase transition-colors #{is_active ? 'text-brand-500' : 'text-slate-300 hover:text-slate-500'}" do
      content = label.html_safe
      content += " <i class='fa-solid #{arrow} text-[7px]'></i>".html_safe if arrow.present?
      content
    end
  end

  def page_window(page:, total:, window: 2)
    return (1..total).to_a if total <= (window * 2 + 3)
    pages = []
    pages << 1
    left = [page - window, 2].max
    right = [page + window, total - 1].min
    pages << :gap if left > 2
    (left..right).each { |p| pages << p }
    pages << :gap if right < total - 1
    pages << total
    pages.uniq
  end

  def words_page_params(overrides = {})
    request.query_parameters
      .slice("language_id", "sort", "dir", "per_page")
      .merge(overrides.stringify_keys)
  end
end
