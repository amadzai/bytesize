class Url < ApplicationRecord
  validates :target_url, presence: true, url: true
  validates :short_url, presence: true, uniqueness: true
end
