class AnalyticsController < ApplicationController
  rate_limit to: 120, within: 1.minute, only: :index, with: RATE_LIMIT_EXCEEDED

  def index
    url = Url.find_by!(short_url: params[:short_url])

    collection = url.analytics.order(created_at: :desc, id: :desc)

    @pagy, analytics = pagy(
      :keyset,
      collection,
      limit: 10,
      client_max_limit: nil # Fixed to limit
    )

    render json: {
      data: analytics.map { |analytic|
        {
          id: analytic.id,
          url_id: analytic.url_id,
          location: analytic.location,
          created_at: analytic.created_at,
          updated_at: analytic.updated_at
        }
      },
      pagination: {
        next: @pagy.next,
        page: @pagy.page,
        limit: @pagy.limit,
        has_more: @pagy.next.present?
      }
    }
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Short URL not found" }, status: :not_found
  end
end
