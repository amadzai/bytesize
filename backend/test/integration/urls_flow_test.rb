require "test_helper"

class UrlsFlowTest < ActionDispatch::IntegrationTest
  test "shorten returns 201 with target_url, short_url, and title" do
    target_url = "https://example.com/path"
    short_code = "abc12345"
    fetched_title = "Example Title"

    Urls::GenerateShortUrl.stub(:call, short_code) do
      Urls::FetchTitle.stub(:call, fetched_title) do
        post "/urls/shorten", params: { url: { target_url: target_url } }
      end
    end

    assert_response :created

    body = JSON.parse(response.body)
    assert_equal target_url, body["target_url"]
    assert_equal short_code, body["short_url"]
    assert_equal fetched_title, body["title"]

    created = Url.find_by(short_url: short_code)
    assert_not_nil created
    assert_equal target_url, created.target_url
    assert_equal fetched_title, created.title
  end

  test "shorten returns 422 with error message for invalid URL" do
    post "/urls/shorten", params: { url: { target_url: "not-a-url" } }

    assert_response :unprocessable_entity

    body = JSON.parse(response.body)
    assert(body["errors"].any? { |msg| msg.include?("valid HTTP or HTTPS URL") })
  end

  test "shorten rate limits after 10 requests per minute" do
    Rails.cache.clear
    codes = (1..11).map { |n| "rate#{n.to_s.rjust(4, '0')}" }

    Urls::GenerateShortUrl.stub(:call, -> { codes.shift }) do
      Urls::FetchTitle.stub(:call, "Rate Title") do
        10.times do
          post "/urls/shorten",
               params: { url: { target_url: "https://example.com/#{SecureRandom.hex(4)}" } },
               headers: { "REMOTE_ADDR" => "203.0.113.10" }
        end

        post "/urls/shorten",
             params: { url: { target_url: "https://example.com/blocked" } },
             headers: { "REMOTE_ADDR" => "203.0.113.10" }
      end
    end

    assert_response :too_many_requests
    body = JSON.parse(response.body)
    assert_equal "Rate limit exceeded. Try again later.", body["error"]
  ensure
    Rails.cache.clear
  end

  test "index returns expected response shape with data and pagination" do
    Url.create!(target_url: "https://example.com/a", short_url: "idx00001", title: "A")
    Url.create!(target_url: "https://example.com/b", short_url: "idx00002", title: "B")

    get "/urls"
    assert_response :success

    body = JSON.parse(response.body)

    assert body.key?("data")
    assert body.key?("pagination")
    assert_kind_of Array, body["data"]
    assert_kind_of Hash, body["pagination"]

    first = body["data"].first
    assert first.key?("target_url")
    assert first.key?("short_url")
    assert first.key?("title")
    assert first.key?("click_count")
  end

  test "redirect returns 302 and increments click_count" do
    url = Url.create!(
      target_url: "https://example.com/redirect-target",
      short_url: "go123456",
      title: "Redirect Target",
      click_count: 0
    )

    get url_redirect_path(short_url: url.short_url)

    assert_response :redirect
    assert_redirected_to url.target_url
    assert_equal 1, url.reload.click_count
  end

  test "redirect returns 404 for unknown short code" do
    get url_redirect_path(short_url: "unknown123")

    assert_response :not_found

    body = JSON.parse(response.body)
    assert_equal "Short URL not found", body["error"]
  end
end
