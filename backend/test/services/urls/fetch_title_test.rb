require "test_helper"
require "net/http"

class Urls::FetchTitleTest < ActiveSupport::TestCase
  test "returns parsed title on successful response" do
    response = success_response("<html><head><title>Example Title</title></head></html>")
    http = FakeHttp.new([ response ])

    Net::HTTP.stub(:new, ->(_host, _port) { http }) do
      title = Urls::FetchTitle.call("https://example.com")
      assert_equal "Example Title", title
      assert_equal 1, http.calls
    end
  end

  test "returns fallback title on non-success response without retrying" do
    response = non_success_response
    http = FakeHttp.new([ response ])

    Net::HTTP.stub(:new, ->(_host, _port) { http }) do
      title = Urls::FetchTitle.call("https://example.com")
      assert_equal "example.com", title
      assert_equal 1, http.calls
    end
  end

  test "returns fallback title immediately when title tag is missing" do
    missing_title = success_response("<html><head></head><body>No title</body></html>")
    http_missing = FakeHttp.new([ missing_title ])

    Net::HTTP.stub(:new, ->(_host, _port) { http_missing }) do
      title = Urls::FetchTitle.call("https://example.com")
      assert_equal "example.com", title
      assert_equal 1, http_missing.calls
    end
  end

  test "returns fallback title immediately when title tag is blank" do
    blank_title = success_response("<html><head><title>   </title></head></html>")
    http_blank = FakeHttp.new([ blank_title ])

    Net::HTTP.stub(:new, ->(_host, _port) { http_blank }) do
      title = Urls::FetchTitle.call("https://example.com")
      assert_equal "example.com", title
      assert_equal 1, http_blank.calls
    end
  end

  test "returns fallback title when request raises an exception" do
    error = Timeout::Error.new("execution expired")
    http = FakeHttp.new([ error ])

    Net::HTTP.stub(:new, ->(_host, _port) { http }) do
      title = Urls::FetchTitle.call("https://example.com")
      assert_equal "example.com", title
      assert_equal 1, http.calls
    end
  end

  test "returns fallback title when request raises multiple errors but only first call is used" do
    error = Timeout::Error.new("execution expired")
    http = FakeHttp.new([ error, error, error ])

    Net::HTTP.stub(:new, ->(_host, _port) { http }) do
      title = Urls::FetchTitle.call("https://example.com")
      assert_equal "example.com", title
      assert_equal 1, http.calls
    end
  end

  test "returns normalized host fallback by stripping www" do
    response = non_success_response
    http = FakeHttp.new([ response ])

    Net::HTTP.stub(:new, ->(_host, _port) { http }) do
      title = Urls::FetchTitle.call("https://www.booking.com/search")
      assert_equal "booking.com", title
      assert_equal 1, http.calls
    end
  end

  test "configures ssl and timeouts for https requests" do
    response = success_response("<html><head><title>Configured</title></head></html>")
    http = FakeHttp.new([ response ])
    Net::HTTP.stub(:new, ->(_host, _port) { http }) do
      title = Urls::FetchTitle.call("https://example.com/path")
      assert_equal "Configured", title
      assert_equal true, http.use_ssl
      assert_equal Urls::FetchTitle::TIMEOUT_SECONDS, http.open_timeout
      assert_equal Urls::FetchTitle::TIMEOUT_SECONDS, http.read_timeout
    end
  end

  test "strips surrounding whitespace from title text" do
    response = success_response("<html><head><title>\n   Hello World   \n</title></head></html>")
    http = FakeHttp.new([ response ])
    Net::HTTP.stub(:new, ->(_host, _port) { http }) do
      title = Urls::FetchTitle.call("https://example.com")
      assert_equal "Hello World", title
    end
  end

  test "follows a single redirect to success" do
    http = FakeHttp.new([
      redirect_response(location: "https://example.com/final"),
      success_response("<html><head><title>Final</title></head></html>")
    ])

    Net::HTTP.stub(:new, ->(_host, _port) { http }) do
      title = Urls::FetchTitle.call("https://example.com")
      assert_equal "Final", title
      assert_equal 2, http.calls
    end
  end

  test "follows redirects up to MAX_ATTEMPTS then parses title" do
    http = FakeHttp.new([
      redirect_response(location: "https://example.com/a"),
      redirect_response(location: "https://example.com/b"),
      redirect_response(location: "https://example.com/c"),
      success_response("<html><head><title>Deep</title></head></html>")
    ])

    Net::HTTP.stub(:new, ->(_host, _port) { http }) do
      title = Urls::FetchTitle.call("https://example.com")
      assert_equal "Deep", title
      assert_equal Urls::FetchTitle::MAX_ATTEMPTS, http.calls
    end
  end

  test "stops after MAX_ATTEMPTS and returns host fallback" do
    actions = Array.new(Urls::FetchTitle::MAX_ATTEMPTS) do
      redirect_response(location: "https://example.com/loop")
    end
    http = FakeHttp.new(actions)

    Net::HTTP.stub(:new, ->(_host, _port) { http }) do
      title = Urls::FetchTitle.call("https://example.com")
      assert_equal "example.com", title
      assert_equal Urls::FetchTitle::MAX_ATTEMPTS, http.calls
    end
  end

  test "returns host fallback when redirect has no Location header" do
    http = FakeHttp.new([ redirect_response(location: nil) ])

    Net::HTTP.stub(:new, ->(_host, _port) { http }) do
      title = Urls::FetchTitle.call("https://example.com")
      assert_equal "example.com", title
      assert_equal 1, http.calls
    end
  end

  test "follows redirect to a different host" do
    http = FakeHttp.new([
      redirect_response(location: "https://other.example.org/page"),
      success_response("<html><head><title>Cross Host</title></head></html>")
    ])

    Net::HTTP.stub(:new, ->(_host, _port) { http }) do
      title = Urls::FetchTitle.call("https://example.com")
      assert_equal "Cross Host", title
      assert_equal 2, http.calls
    end
  end

  test "upgrades scheme on redirect from http to https" do
    http = FakeHttp.new([
      redirect_response(location: "https://example.com/secure"),
      success_response("<html><head><title>Secure</title></head></html>")
    ])

    Net::HTTP.stub(:new, ->(_host, _port) { http }) do
      title = Urls::FetchTitle.call("http://example.com")
      assert_equal "Secure", title
      assert_equal true, http.use_ssl
    end
  end

  private

  def success_response(body)
    Net::HTTPResponse::CODE_TO_OBJ.fetch("200").new("1.1", "200", "OK").tap do |response|
      response.instance_variable_set(:@body, body)
      response.instance_variable_set(:@read, true)
    end
  end

  def non_success_response(status_code: "404", message: "Not Found", body: "")
    Net::HTTPResponse::CODE_TO_OBJ.fetch(status_code).new("1.1", status_code, message).tap do |response|
      response.instance_variable_set(:@body, body)
      response.instance_variable_set(:@read, true)
    end
  end

  def redirect_response(location:, status_code: "302", message: "Found")
    Net::HTTPResponse::CODE_TO_OBJ.fetch(status_code).new("1.1", status_code, message).tap do |response|
      response.instance_variable_set(:@body, "")
      response.instance_variable_set(:@read, true)
      response["location"] = location if location
    end
  end

  class FakeHttp
    attr_accessor :use_ssl, :open_timeout, :read_timeout
    attr_reader :calls

    def initialize(actions)
      @actions = actions
      @calls = 0
    end

    def get(_request_uri, _headers = nil)
      @calls += 1
      action = @actions.shift
      raise action if action.is_a?(Exception)

      action
    end
  end
end
