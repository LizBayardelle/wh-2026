class Word < ApplicationRecord
  belongs_to :user
  belongs_to :language
  has_many :word_stashes, dependent: :destroy
  has_many :stashes, through: :word_stashes

  PARTS_OF_SPEECH = %w[noun verb adjective adverb pronoun preposition conjunction interjection particle counter phrase expression].freeze
  FORMALITIES = %w[casual polite formal honorific humble].freeze
  REGISTERS = %w[spoken written literary slang archaic technical].freeze
  GENDERS = %w[masculine feminine neuter common].freeze

  validates :term, presence: true
  validates :translation, presence: true
  validates :mastery_level, inclusion: { in: 0..5 }
  validates :part_of_speech, inclusion: { in: PARTS_OF_SPEECH }, allow_blank: true
  validates :formality, inclusion: { in: FORMALITIES }, allow_blank: true
  validates :register, inclusion: { in: REGISTERS }, allow_blank: true
  validates :gender, inclusion: { in: GENDERS }, allow_blank: true

  scope :due_for_review, -> { where("next_review_at <= ?", Time.current) }
  scope :mastered, -> { where(mastery_level: 5) }
  scope :learning, -> { where(mastery_level: 0..4) }
end
