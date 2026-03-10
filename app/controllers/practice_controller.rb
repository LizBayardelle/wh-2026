class PracticeController < ApplicationController
  before_action :authenticate_user!

  def index
    @languages = current_user.languages.active.order(:name)
    @stashes = current_user.stashes
      .joins(:words)
      .select("stashes.*, COUNT(words.id) as words_count")
      .group("stashes.id")
      .having("COUNT(words.id) > 0")
      .order(:name)
    @stash_languages = {}
    @stashes.each do |stash|
      @stash_languages[stash.id] = stash.words.joins(:language).distinct.pluck("languages.id", "languages.code", "languages.name")
    end
    @recent_sessions = current_user.practice_sessions
      .completed
      .order(completed_at: :desc)
      .limit(10)
      .includes(:language, :stash)
  end

  def show
    @session = current_user.practice_sessions.find(params[:id])

    if @session.status == "completed"
      render :results
      return
    end

    words = if @session.stash_id
      @session.stash.words.includes(:language)
    elsif @session.language_id
      current_user.words.where(language_id: @session.language_id)
    else
      current_user.words.includes(:language)
    end

    attempted_word_ids = @session.practice_attempts.pluck(:word_id)
    @words = words.order("RANDOM()").to_a
    @session_json = {
      id: @session.id,
      status: @session.status,
      totalWords: @words.size,
      wordsSeen: @session.words_seen,
      correctCount: @session.correct_count,
      incorrectCount: @session.incorrect_count,
      label: @session.label
    }.to_json
    @words_json = @words.map { |w|
      {
        id: w.id,
        term: w.term,
        romanization: w.romanization,
        pronunciation: w.pronunciation,
        translation: w.translation,
        alternativeTranslations: w.alternative_translations,
        language: w.language.name,
        partOfSpeech: w.part_of_speech,
        exampleSentence: w.example_sentence,
        exampleTranslation: w.example_translation,
        attempted: attempted_word_ids.include?(w.id)
      }
    }.to_json
  end

  def create
    language_id = params[:language_id].presence
    stash_id = params[:stash_id].presence

    word_count = if stash_id
      current_user.stashes.find(stash_id).words.count
    elsif language_id
      current_user.words.where(language_id: language_id).count
    else
      0
    end

    if word_count == 0
      redirect_to practice_index_path, alert: "No words to practice."
      return
    end

    session = current_user.practice_sessions.create!(
      language_id: language_id,
      stash_id: stash_id,
      session_type: "flashcard",
      status: "in_progress",
      total_words: word_count,
      started_at: Time.current
    )

    redirect_to practice_path(session)
  end

  def complete
    session = current_user.practice_sessions.find(params[:id])
    session.complete!
    render json: { status: "completed", accuracy: session.accuracy, duration: session.duration_seconds }
  end
end
