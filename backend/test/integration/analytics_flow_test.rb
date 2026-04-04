require "test_helper"

class AnalyticsFlowTest < ActionDispatch::IntegrationTest
  test "index returns expected response shape with data and pagination" do
    url = Url.create!(
      target_url: "https://example.com/analytics-target",
      short_url: "ana00001",
      title: "Analytics Target"
    )

    older = url.analytics.create!(location: "Paris, France", created_at: 2.minutes.ago)
    newer = url.analytics.create!(location: "Berlin, Germany", created_at: 1.minute.ago)

    get "/urls/#{url.short_url}/analytics"

    assert_response :success

    body = JSON.parse(response.body)

    assert body.key?("data")
    assert body.key?("pagination")
    assert_kind_of Array, body["data"]
    assert_kind_of Hash, body["pagination"]

    assert_equal 2, body["data"].length
    first = body["data"].first
    second = body["data"].second

    assert_equal newer.id, first["id"]
    assert_equal older.id, second["id"]

    assert first.key?("id")
    assert first.key?("url_id")
    assert first.key?("location")
    assert first.key?("created_at")
    assert first.key?("updated_at")

    pagination = body["pagination"]
    assert pagination.key?("next")
    assert pagination.key?("page")
    assert pagination.key?("limit")
    assert pagination.key?("has_more")
    assert_equal 10, pagination["limit"]
    assert_equal false, pagination["has_more"]
  end

  test "index returns 404 when short url does not exist" do
    get "/urls/unknown123/analytics"

    assert_response :not_found

    body = JSON.parse(response.body)
    assert_equal "Short URL not found", body["error"]
  end

  test "index rate limits after 60 requests per minute per ip" do
    Rails.cache.clear

    url = Url.create!(
      target_url: "https://example.com/rate-target",
      short_url: "ana00002",
      title: "Rate Target"
    )
    url.analytics.create!(location: "Unknown")

    60.times do
      get "/urls/#{url.short_url}/analytics", headers: { "REMOTE_ADDR" => "203.0.113.11" }
      assert_response :success
    end

    get "/urls/#{url.short_url}/analytics", headers: { "REMOTE_ADDR" => "203.0.113.11" }

    assert_response :too_many_requests
    body = JSON.parse(response.body)
    assert_equal "Rate limit exceeded. Try again later.", body["error"]
  ensure
    Rails.cache.clear
  end
end
