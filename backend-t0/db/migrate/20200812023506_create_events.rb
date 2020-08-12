class CreateEvents < ActiveRecord::Migration[6.0]
  def change
    create_table :events, id: :uuid do |t|
      t.string :event_name
      t.string :event_category
      t.string :event_place
      t.string :event_address
      t.date :event_initial_date
      t.date :event_final_date
      t.string :event_type
      t.string :thumbnail
      t.references :user, null: false, foreign_key: true, type: :string

      t.timestamps
    end
  end
end
