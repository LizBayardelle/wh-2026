class CreatePracticeSessions < ActiveRecord::Migration[8.1]
  def change
    create_table :practice_sessions do |t|
      t.references :user, null: false, foreign_key: true
      t.references :language, foreign_key: true
      t.references :stash, foreign_key: true
      t.string :session_type, null: false, default: "flashcard"
      t.string :status, null: false, default: "in_progress"
      t.integer :total_words, default: 0
      t.integer :words_seen, default: 0
      t.integer :correct_count, default: 0
      t.integer :incorrect_count, default: 0
      t.integer :skipped_count, default: 0
      t.datetime :started_at
      t.datetime :completed_at
      t.integer :duration_seconds

      t.timestamps
    end
  end
end
