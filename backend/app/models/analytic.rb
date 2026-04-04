class Analytic < ApplicationRecord
  belongs_to :url

  validates :location, presence: true
end
