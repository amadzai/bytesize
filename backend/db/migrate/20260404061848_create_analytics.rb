class CreateAnalytics < ActiveRecord::Migration[8.1]
  def change
    create_table :analytics, id: :uuid do |t|
      t.references :url, null: false, foreign_key: true, type: :uuid
      t.string :location, null: false

      t.timestamps
    end
  end
end
