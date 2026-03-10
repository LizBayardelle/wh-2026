class CreateWordStashes < ActiveRecord::Migration[8.1]
  def change
    create_table :word_stashes do |t|
      t.references :word, null: false, foreign_key: true
      t.references :stash, null: false, foreign_key: true

      t.timestamps
    end

    add_index :word_stashes, [:word_id, :stash_id], unique: true
  end
end
