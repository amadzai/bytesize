module Urls
  class GenerateShortUrl
    # 62^8 = ~218T possible combinations
    LENGTH = 8

    def self.call
      new.call
    end

    def call
      SecureRandom.alphanumeric(LENGTH)
    end
  end
end
