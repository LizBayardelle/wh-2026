class CreatePracticeAttempts < ActiveRecord::Migration[8.1]
  def change
    create_table :practice_attempts do |t|
      t.references :practice_session, null: false, foreign_key: true
      t.references :word, null: false, foreign_key: true
      t.boolean :correct
      t.integer :attempt_number
      t.integer :response_time_ms

      t.timestamps
    end
  end
end
