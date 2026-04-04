require "test_helper"

class UrlTest < ActiveSupport::TestCase
  test "is valid with https target_url and short_url" do
    url = Url.new(target_url: "https://example.com/docs", short_url: "docs0001")

    assert url.valid?
  end

  test "is invalid without target_url" do
    url = Url.new(target_url: nil, short_url: "empty001")

    assert_not url.valid?
    assert_includes url.errors[:target_url], "can't be blank"
  end

  test "is invalid with non-http(s) target_url" do
    url = Url.new(target_url: "ftp://example.com/file", short_url: "ftp00001")

    assert_not url.valid?
    assert_includes url.errors[:target_url], "must be a valid HTTP or HTTPS URL"
  end

  test "is invalid when target_url is http with empty host" do
    url = Url.new(target_url: "http://", short_url: "nohost02")

    assert_not url.valid?
    assert_includes url.errors[:target_url], "must be a valid HTTP or HTTPS URL"
  end

  test "is invalid when target_url has http(s) scheme but no host" do
    url = Url.new(target_url: "https:///path-only", short_url: "nohost01")

    assert_not url.valid?
    assert_includes url.errors[:target_url], "must be a valid HTTP or HTTPS URL"
  end

  test "is invalid with duplicate short_url" do
    existing = urls(:one)
    duplicate = Url.new(target_url: "https://another-example.com", short_url: existing.short_url)

    assert_not duplicate.valid?
    assert_includes duplicate.errors[:short_url], "has already been taken"
  end
end
