require "test_helper"

class Analytics::TrackVisitLocationJobTest < ActiveJob::TestCase
  test "creates analytic with fetched location" do
    url = urls(:one)

    Analytics::FetchLocation.stub(:call, "Berlin, Germany") do
      assert_difference("Analytic.count", 1) do
        perform_enqueued_jobs do
          Analytics::TrackVisitLocationJob.perform_later(url.id, "8.8.8.8")
        end
      end
    end

    analytic = Analytic.order(:created_at).last
    assert_equal url.id, analytic.url_id
    assert_equal "Berlin, Germany", analytic.location
  end

  test "discards job and does not create analytic when location is invalid" do
    url = urls(:one)

    Analytics::FetchLocation.stub(:call, nil) do
      assert_no_difference("Analytic.count") do
        perform_enqueued_jobs do
          Analytics::TrackVisitLocationJob.perform_later(url.id, "8.8.4.4")
        end
      end
    end
  end
end
