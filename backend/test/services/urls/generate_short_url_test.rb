require "test_helper"

class Urls::GenerateShortUrlTest < ActiveSupport::TestCase
  test "returns an 8 character short url code" do
    code = Urls::GenerateShortUrl.call

    assert_equal 8, code.length
  end

  test "returns an alphanumeric short url code" do
    code = Urls::GenerateShortUrl.call

    assert_match(/\A[a-zA-Z0-9]{8}\z/, code)
  end
end
