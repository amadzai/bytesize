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

  test "retries when generated code already exists and returns a unique code" do
    existing_code = "abc12345"
    new_code = "xyz67890"

    Url.create!(
      target_url: "https://example.com/existing",
      short_url: existing_code,
      title: "Existing"
    )

    generated_codes = [ existing_code, new_code ]
    fake = ->(_length) { generated_codes.shift }

    SecureRandom.stub(:alphanumeric, fake) do
      code = Urls::GenerateShortUrl.call

      assert_equal new_code, code
    end
  end
end
