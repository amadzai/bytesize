class CreateAnalytics < ActiveRecord::Migration[8.1]
  def change
    create_table :analytics, id: :uuid do |t|
      t.references :url, null: false, foreign_key: true, type: :uuid, index: false
      t.string :location, null: false

      t.timestamps
    end

    add_index :analytics, [ :url_id, :created_at, :id ],
              order: { created_at: :desc, id: :desc },
              name: "index_analytics_on_url_id_created_at_id_desc"
  end
end
