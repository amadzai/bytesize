require "net/http"
require "json"

module Analytics
  class FetchLocation
    BASE_URL = "http://ip-api.com/json"
    MAX_RETRIES = 3
    TIMEOUT_SECONDS = 2
    FALLBACK_LOCATION = "Unknown"

    def self.call(ip_address)
      new(ip_address).call
    end

    def initialize(ip_address)
      @ip_address = ip_address
    end

    def call
      uri = URI.parse("#{BASE_URL}/#{@ip_address}?fields=status,message,city,country")

      MAX_RETRIES.times do |attempt|
        begin
          http = Net::HTTP.new(uri.host, uri.port)
          http.open_timeout = TIMEOUT_SECONDS
          http.read_timeout = TIMEOUT_SECONDS

          response = http.get(uri.request_uri)
          next unless response.is_a?(Net::HTTPSuccess)

          payload = JSON.parse(response.body)

          unless payload["status"] == "success"
            Rails.logger.info("Location lookup failed for #{@ip_address}: #{payload["message"]}")
            return FALLBACK_LOCATION
          end

          city = payload["city"].to_s.strip
          country = payload["country"].to_s.strip
          location = [ city, country ].reject(&:blank?).join(", ")

          return location.presence || FALLBACK_LOCATION
        rescue StandardError => e
          Rails.logger.warn("Attempt #{attempt + 1} failed for #{@ip_address}: #{e.class} - #{e.message}")
        end
      end

      FALLBACK_LOCATION
    end
  end
end
