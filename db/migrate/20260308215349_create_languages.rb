class CreateLanguages < ActiveRecord::Migration[8.1]
  def change
    create_table :languages do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name, null: false
      t.string :code
      t.string :native_name
      t.string :proficiency, default: "beginner", null: false
      t.boolean :active, default: true, null: false
      t.boolean :custom, default: false, null: false

      t.timestamps
    end
  end
end
