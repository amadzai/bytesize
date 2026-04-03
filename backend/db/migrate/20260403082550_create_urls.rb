class CreateUrls < ActiveRecord::Migration[8.1]
  def change
    create_table :urls, id: :uuid do |t|
      t.string :title
      t.string :target_url, null: false
      t.string :short_url, null: false
      t.integer :click_count, default: 0, null: false

      t.timestamps
    end

    add_index :urls, :short_url, unique: true
  end
end
