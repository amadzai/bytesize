require "net/http"

module Urls
  class FetchTitle
    TIMEOUT_SECONDS = 2

    def self.call(target_url)
      new(target_url).call
    end

    def initialize(target_url)
      @target_url = target_url
    end

    def call
      uri = URI.parse(@target_url)
      host = uri.host.to_s.sub(/\Awww\./i, "")

      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = uri.scheme == "https"
      http.open_timeout = TIMEOUT_SECONDS
      http.read_timeout = TIMEOUT_SECONDS

      response = http.get(uri.request_uri)
      return host unless response.is_a?(Net::HTTPSuccess)

      title = Nokogiri::HTML(response.body).at_css("title")&.text&.strip
      title.presence || host
    rescue StandardError => e
      Rails.logger.warn("Failed to fetch title for #{@target_url}: #{e.class} - #{e.message}")
      host
    end
  end
end
