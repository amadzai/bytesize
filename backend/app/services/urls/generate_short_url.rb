module Urls
  class GenerateShortUrl
    # 62^8 = ~218T possible combinations
    LENGTH = 8

    def self.call
      new.call
    end

    def call
      loop do
        code = SecureRandom.alphanumeric(LENGTH)
        break code unless Url.exists?(short_url: code)
      end
    end
  end
end
