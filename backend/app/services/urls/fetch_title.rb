require "net/http"

module Urls
  class FetchTitle
    def self.call(target_url)
      new(target_url).call
    end

    def initialize(target_url)
      @target_url = target_url
    end

    def call
      uri = URI.parse(@target_url)
      response = Net::HTTP.get_response(uri)
      doc = Nokogiri::HTML(response.body)
      doc.at_css("title")&.text&.strip
    rescue URI::InvalidURIError, SocketError, Net::OpenTimeout, Net::ReadTimeout => e
      Rails.logger.warn("Failed to fetch title for #{@target_url}: #{e.message}")
      nil
    end
  end
end
