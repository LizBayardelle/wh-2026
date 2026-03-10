class AddTimesCorrectToWords < ActiveRecord::Migration[8.1]
  def change
    add_column :words, :times_correct, :integer, default: 0, null: false
  end
end
