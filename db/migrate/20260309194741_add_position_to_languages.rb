class AddPositionToLanguages < ActiveRecord::Migration[8.1]
  def change
    add_column :languages, :position, :integer, default: 0, null: false
  end
end
