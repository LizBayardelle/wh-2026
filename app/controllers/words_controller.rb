class WordsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_word, only: [:update, :destroy]

  SORTABLE = {
    "term" => "words.term",
    "translation" => "words.translation",
    "type" => "words.part_of_speech",
    "reviewed" => "words.times_reviewed",
    "accuracy" => "words.times_correct",
    "created" => "words.created_at"
  }.freeze

  PER_PAGE_OPTIONS = [10, 25, 50, 100].freeze

  def index
    @languages = current_user.languages.active.order(:name)
    @stashes = current_user.stashes.order(:name)
    @active_language_id = params[:language_id].presence || "all"
    @sort = SORTABLE.key?(params[:sort]) ? params[:sort] : "created"
    @dir = params[:dir] == "asc" ? "asc" : "desc"
    @per_page = PER_PAGE_OPTIONS.include?(params[:per_page].to_i) ? params[:per_page].to_i : 25
    @page = [params[:page].to_i, 1].max

    base = current_user.words.includes(:language, :stashes)
    order_clause = "#{SORTABLE[@sort]} #{@dir}"

    if @active_language_id == "all"
      @total_count = base.count
      @words = base.order(Arel.sql(order_clause)).offset((@page - 1) * @per_page).limit(@per_page)
    else
      lang_id = @active_language_id.to_i
      scoped = base.where(language_id: lang_id)
      @total_count = scoped.count
      @words = scoped.order(Arel.sql(order_clause)).offset((@page - 1) * @per_page).limit(@per_page)
    end

    @total_pages = (@total_count.to_f / @per_page).ceil
  end

  def create
    @word = current_user.words.build(word_params)

    if @word.save
      sync_stashes(@word)
      redirect_to words_path(language_id: redirect_language_id), notice: "\"#{@word.term}\" added to your collection."
    else
      redirect_to words_path(language_id: params[:return_to_language]), alert: @word.errors.full_messages.join(", ")
    end
  end

  def update
    if @word.update(word_params)
      sync_stashes(@word)
      redirect_to words_path(language_id: redirect_language_id), notice: "\"#{@word.term}\" updated."
    else
      redirect_to words_path(language_id: params[:return_to_language]), alert: @word.errors.full_messages.join(", ")
    end
  end

  def destroy
    term = @word.term
    @word.destroy
    redirect_to words_path(language_id: params[:return_to_language]), notice: "\"#{term}\" removed."
  end

  private

  def set_word
    @word = current_user.words.find(params[:id])
  end

  def word_params
    params.require(:word).permit(
      :language_id, :term, :romanization, :pronunciation,
      :translation, :alternative_translations, :part_of_speech,
      :pitch_accent, :formality, :register, :gender, :plural,
      :example_sentence, :example_translation, :usage_notes,
      :notes, :source
    )
  end

  def redirect_language_id
    return_tab = params[:return_to_language]
    word_lang = @word.language_id.to_s

    # If on "all" tab, stay on "all"
    # If on a specific tab and the word matches, stay there
    # If on a specific tab but the word is a different language, go to that language
    if return_tab == "all" || return_tab == word_lang
      return_tab
    else
      word_lang
    end
  end

  def sync_stashes(word)
    stash_names = (params[:stash_names] || "").split(",").map(&:strip).reject(&:blank?)
    stashes = stash_names.map do |name|
      current_user.stashes.find_or_create_by!(name: name)
    end
    word.stashes = stashes
  end
end
