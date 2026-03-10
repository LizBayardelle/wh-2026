class CreateWords < ActiveRecord::Migration[8.1]
  def change
    create_table :words do |t|
      t.references :user, null: false, foreign_key: true
      t.references :language, null: false, foreign_key: true

      # Core
      t.string :term, null: false
      t.string :romanization
      t.string :pronunciation
      t.string :translation, null: false
      t.string :alternative_translations

      # Linguistic metadata
      t.string :part_of_speech
      t.string :pitch_accent
      t.string :formality
      t.string :register
      t.string :gender
      t.string :plural

      # Context
      t.text :example_sentence
      t.text :example_translation
      t.text :usage_notes
      t.text :notes
      t.string :source

      # Gamification / spaced repetition
      t.integer :mastery_level, default: 0, null: false
      t.integer :times_reviewed, default: 0, null: false
      t.datetime :last_reviewed_at
      t.datetime :next_review_at

      t.timestamps
    end

    add_index :words, [:user_id, :language_id]
    add_index :words, :next_review_at
  end
end
