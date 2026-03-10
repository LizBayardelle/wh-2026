class PracticeSession < ApplicationRecord
  belongs_to :user
  belongs_to :language, optional: true
  belongs_to :stash, optional: true
  has_many :practice_attempts, dependent: :destroy

  TYPES = %w[flashcard quiz typing listening].freeze
  STATUSES = %w[in_progress completed abandoned].freeze

  validates :session_type, inclusion: { in: TYPES }
  validates :status, inclusion: { in: STATUSES }

  scope :completed, -> { where(status: "completed") }
  scope :in_progress, -> { where(status: "in_progress") }
  scope :today, -> { where(started_at: Time.current.beginning_of_day..) }

  def complete!
    update!(
      status: "completed",
      completed_at: Time.current,
      duration_seconds: started_at ? (Time.current - started_at).to_i : 0
    )
  end

  # First-try accuracy: correct on attempt_number 1
  def accuracy
    return 0 if words_seen.zero?
    (correct_count.to_f / words_seen * 100).round
  end

  # Session total: % of unique words eventually answered correctly
  def total_accuracy
    return 0 if total_words.zero?
    mastered = practice_attempts.where(correct: true).select(:word_id).distinct.count
    (mastered.to_f / total_words * 100).round
  end

  def label
    stash&.name || language&.name || "Practice"
  end

  def language_label
    if language
      language.name
    elsif stash
      langs = stash.words.joins(:language).distinct.pluck("languages.name")
      langs.size <= 1 ? (langs.first || "—") : "Mixed"
    else
      "—"
    end
  end
end
