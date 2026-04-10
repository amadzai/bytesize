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

  test "is invalid when http url has no host" do
    url = Url.new(target_url: "http://", short_url: "nohost01")
    assert_not url.valid?
    assert_includes url.errors[:target_url], "must be a valid HTTP or HTTPS URL"
  end

  test "is invalid when https url has no host" do
    url = Url.new(target_url: "https://", short_url: "nohost02")
    assert_not url.valid?
    assert_includes url.errors[:target_url], "must be a valid HTTP or HTTPS URL"
  end

  test "is invalid with duplicate short_url" do
    existing = urls(:one)
    duplicate = Url.new(target_url: "https://example.com", short_url: existing.short_url)

    assert_not duplicate.valid?
    assert_includes duplicate.errors[:short_url], "has already been taken"
  end

  test "is invalid when target_url cannot be parsed as URI" do
    url = Url.new(target_url: "https://example.com/%zz", short_url: "baduri01")

    assert_not url.valid?
    assert_includes url.errors[:target_url], "must be a valid HTTP or HTTPS URL"
  end
end
