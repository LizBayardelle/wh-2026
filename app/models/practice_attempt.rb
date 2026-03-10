class PracticeAttempt < ApplicationRecord
  belongs_to :practice_session
  belongs_to :word

  validates :attempt_number, presence: true, numericality: { greater_than: 0 }
end
