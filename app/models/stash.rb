class Stash < ApplicationRecord
  belongs_to :user
  has_many :word_stashes, dependent: :destroy
  has_many :words, through: :word_stashes

  COLORS = %w[brand reward slate rose amber emerald sky purple].freeze

  validates :name, presence: true, uniqueness: { scope: :user_id }
  validates :color, inclusion: { in: COLORS }
end
