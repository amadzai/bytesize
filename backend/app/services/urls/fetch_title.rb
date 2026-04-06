require "net/http"

module Urls
  class FetchTitle
    TIMEOUT_SECONDS = 2
    FALLBACK_TITLE = "Unknown Title"

    def self.call(target_url)
      new(target_url).call
    end

    def initialize(target_url)
      @target_url = target_url
    end

    def call
      uri = URI.parse(@target_url)

      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = uri.scheme == "https"
      http.open_timeout = TIMEOUT_SECONDS
      http.read_timeout = TIMEOUT_SECONDS

      response = http.get(uri.request_uri)
      return FALLBACK_TITLE unless response.is_a?(Net::HTTPSuccess)

      title = Nokogiri::HTML(response.body).at_css("title")&.text&.strip
      title.presence || FALLBACK_TITLE
    rescue StandardError => e
      Rails.logger.warn("Failed to fetch title for #{@target_url}: #{e.class} - #{e.message}")
      FALLBACK_TITLE
    end
  end
end
