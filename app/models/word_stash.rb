class WordStash < ApplicationRecord
  belongs_to :word
  belongs_to :stash

  validates :stash_id, uniqueness: { scope: :word_id }
end
