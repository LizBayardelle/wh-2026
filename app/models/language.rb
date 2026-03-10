class Language < ApplicationRecord
  belongs_to :user
  has_many :words, dependent: :destroy

  PROFICIENCIES = %w[beginner intermediate advanced native].freeze

  validates :name, presence: true
  validates :proficiency, inclusion: { in: PROFICIENCIES }

  default_scope { order(:position, :name) }

  scope :active, -> { where(active: true) }
  scope :standard, -> { where(custom: false) }
  scope :custom, -> { where(custom: true) }
end
