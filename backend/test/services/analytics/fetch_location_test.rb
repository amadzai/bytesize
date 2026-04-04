require "test_helper"
require "net/http"
require "json"

class Analytics::FetchLocationTest < ActiveSupport::TestCase
  test "returns city and country on successful response" do
    response = success_response({ status: "success", city: "Berlin", country: "Germany" }.to_json)
    http = FakeHttp.new([ response ])

    Net::HTTP.stub(:new, ->(_host, _port) { http }) do
      location = Analytics::FetchLocation.call("8.8.8.8")

      assert_equal "Berlin, Germany", location
      assert_equal 1, http.calls
      assert_equal Analytics::FetchLocation::TIMEOUT_SECONDS, http.open_timeout
      assert_equal Analytics::FetchLocation::TIMEOUT_SECONDS, http.read_timeout
      assert_equal "/json/8.8.8.8?fields=status,message,city,country", http.last_request_uri
    end
  end

  test "returns country when city is blank" do
    response = success_response({ status: "success", city: "", country: "Germany" }.to_json)
    http = FakeHttp.new([ response ])

    Net::HTTP.stub(:new, ->(_host, _port) { http }) do
      location = Analytics::FetchLocation.call("8.8.8.8")

      assert_equal "Germany", location
      assert_equal 1, http.calls
    end
  end

  test "returns city when country is blank" do
    response = success_response({ status: "success", city: "Berlin", country: "" }.to_json)
    http = FakeHttp.new([ response ])

    Net::HTTP.stub(:new, ->(_host, _port) { http }) do
      location = Analytics::FetchLocation.call("8.8.8.8")

      assert_equal "Berlin", location
      assert_equal 1, http.calls
    end
  end

  test "returns fallback when api responds with failed status" do
    response = success_response({ status: "fail", message: "private range" }.to_json)
    http = FakeHttp.new([ response ])

    Net::HTTP.stub(:new, ->(_host, _port) { http }) do
      location = Analytics::FetchLocation.call("192.168.0.1")

      assert_equal Analytics::FetchLocation::FALLBACK_LOCATION, location
      assert_equal 1, http.calls
    end
  end

  test "retries on non-success http responses and returns fallback" do
    response = non_success_response(status_code: "500", message: "Server Error")
    http = FakeHttp.new([ response ] * Analytics::FetchLocation::MAX_RETRIES)

    Net::HTTP.stub(:new, ->(_host, _port) { http }) do
      location = Analytics::FetchLocation.call("8.8.8.8")

      assert_equal Analytics::FetchLocation::FALLBACK_LOCATION, location
      assert_equal Analytics::FetchLocation::MAX_RETRIES, http.calls
    end
  end

  test "retries on exception and returns location when a later attempt succeeds" do
    error = Timeout::Error.new("execution expired")
    response = success_response({ status: "success", city: "Paris", country: "France" }.to_json)
    http = FakeHttp.new([ error, response ])

    Net::HTTP.stub(:new, ->(_host, _port) { http }) do
      location = Analytics::FetchLocation.call("8.8.8.8")

      assert_equal "Paris, France", location
      assert_equal 2, http.calls
    end
  end

  test "returns fallback after max retries when all attempts raise errors" do
    error = Timeout::Error.new("execution expired")
    http = FakeHttp.new([ error, error, error ])

    Net::HTTP.stub(:new, ->(_host, _port) { http }) do
      location = Analytics::FetchLocation.call("8.8.8.8")

      assert_equal Analytics::FetchLocation::FALLBACK_LOCATION, location
      assert_equal Analytics::FetchLocation::MAX_RETRIES, http.calls
    end
  end

  private

  def success_response(body)
    Net::HTTPResponse::CODE_TO_OBJ.fetch("200").new("1.1", "200", "OK").tap do |response|
      response.instance_variable_set(:@body, body)
      response.instance_variable_set(:@read, true)
    end
  end

  def non_success_response(status_code:, message:, body: "")
    Net::HTTPResponse::CODE_TO_OBJ.fetch(status_code).new("1.1", status_code, message).tap do |response|
      response.instance_variable_set(:@body, body)
      response.instance_variable_set(:@read, true)
    end
  end

  class FakeHttp
    attr_accessor :open_timeout, :read_timeout
    attr_reader :calls, :last_request_uri

    def initialize(actions)
      @actions = actions
      @calls = 0
    end

    def get(request_uri)
      @calls += 1
      @last_request_uri = request_uri

      action = @actions.shift
      raise action if action.is_a?(Exception)

      action
    end
  end
end
