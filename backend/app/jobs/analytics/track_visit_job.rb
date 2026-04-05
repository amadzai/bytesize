module Analytics
  class TrackVisitJob < ApplicationJob
    queue_as :default

    discard_on ActiveRecord::RecordInvalid, ActiveRecord::InvalidForeignKey

    def perform(url_id, ip_address)
      location = Analytics::FetchLocation.call(ip_address)
      Analytic.create!(url_id:, location:)
    end
  end
end
