class AnalyticsController < ApplicationController
  def index
    url = Url.find_by!(short_url: params[:short_url])
    analytics = url.analytics.order(created_at: :desc)

    render json: {
      data: analytics.map { |analytic|
        {
          id: analytic.id,
          url_id: analytic.url_id,
          location: analytic.location,
          created_at: analytic.created_at,
          updated_at: analytic.updated_at
        }
      }
    }
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Short URL not found" }, status: :not_found
  end
end
