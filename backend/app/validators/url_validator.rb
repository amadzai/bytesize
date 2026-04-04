class UrlValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    return if value.blank?

    uri = URI.parse(value)
    valid = (uri.is_a?(URI::HTTP) || uri.is_a?(URI::HTTPS)) && uri.host.present?
    record.errors.add(attribute, "must be a valid HTTP or HTTPS URL") unless valid
  rescue URI::InvalidURIError
    record.errors.add(attribute, "must be a valid HTTP or HTTPS URL")
  end
end
