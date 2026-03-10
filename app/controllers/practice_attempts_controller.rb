class PracticeAttemptsController < ApplicationController
  before_action :authenticate_user!

  def create
    session = current_user.practice_sessions.find(params[:practice_id])

    attempt = session.practice_attempts.create!(
      word_id: params[:word_id],
      correct: params[:correct],
      attempt_number: params[:attempt_number] || 1,
      response_time_ms: params[:response_time_ms]
    )

    # Update session counters
    session.update!(
      words_seen: session.practice_attempts.select(:word_id).distinct.count,
      correct_count: session.practice_attempts.where(attempt_number: 1, correct: true).count,
      incorrect_count: session.practice_attempts.where(attempt_number: 1, correct: false).count
    )

    # Update word review tracking
    word = current_user.words.find(params[:word_id])
    is_correct = ActiveModel::Type::Boolean.new.cast(params[:correct])
    attrs = { times_reviewed: word.times_reviewed + 1, last_reviewed_at: Time.current }
    attrs[:times_correct] = word.times_correct + 1 if is_correct
    word.update!(attrs)

    render json: {
      id: attempt.id,
      wordsSeen: session.words_seen,
      correctCount: session.correct_count,
      incorrectCount: session.incorrect_count
    }
  end
end
