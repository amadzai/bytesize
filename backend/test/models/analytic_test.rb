require "test_helper"

class AnalyticTest < ActiveSupport::TestCase
  test "is valid with location and url" do
    analytic = Analytic.new(url: urls(:one), location: "US")

    assert analytic.valid?
  end

  test "is invalid without location" do
    analytic = Analytic.new(url: urls(:one), location: nil)

    assert_not analytic.valid?
    assert_includes analytic.errors[:location], "can't be blank"
  end

  test "is invalid without url" do
    analytic = Analytic.new(url: nil, location: "US")

    assert_not analytic.valid?
    assert_includes analytic.errors[:url], "must exist"
  end
end
