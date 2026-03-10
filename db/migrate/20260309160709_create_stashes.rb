class CreateStashes < ActiveRecord::Migration[8.1]
  def change
    create_table :stashes do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name, null: false
      t.string :description
      t.string :color, default: "brand"

      t.timestamps
    end

    add_index :stashes, [:user_id, :name], unique: true
  end
end
