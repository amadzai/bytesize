class UrlsController < ApplicationController
  RATE_LIMIT_EXCEEDED = -> {
    render json: { error: "Rate limit exceeded. Try again later." }, status: :too_many_requests
  }

  rate_limit to: 10, within: 1.minute, only: :shorten, with: RATE_LIMIT_EXCEEDED
  rate_limit to: 60, within: 1.minute, only: :index, with: RATE_LIMIT_EXCEEDED

  def shorten
    target_url = url_params[:target_url]

    url = Url.new(target_url: target_url)
    url.validate

    if url.errors[:target_url].present?
      return render json:
        {
          errors: url.errors.full_messages_for(:target_url)
        }, status: :unprocessable_entity
    end

    url.short_url = Urls::GenerateShortUrl.call
    url.title = Urls::FetchTitle.call(target_url)

    if url.save
      render json: {
        target_url: url.target_url,
        short_url: url.short_url,
        title: url.title
      }, status: :created
    else
      render json: { errors: url.errors.full_messages }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotUnique
    retry
  end

  def index
    collection = Url.order(created_at: :desc)

    @pagy, urls = pagy(
      :countish,
      collection,
      limit: 10,
      client_max_limit: nil, # Fixed to limit
      ttl: 300
    )

    render json: {
      data: urls.map { |url|
        {
          target_url: url.target_url,
          short_url: url.short_url,
          title: url.title,
          click_count: url.click_count
        }
      },
      pagination: @pagy.data_hash(
        data_keys: %i[page previous next previous_url next_url]
      )
    }
  end

  def redirect
    url = Url.select(:id, :target_url).find_by!(short_url: params[:short_url])

    Url.increment_counter(:click_count, url.id)

    redirect_to url.target_url, status: :found, allow_other_host: true
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Short URL not found" }, status: :not_found
  end

  private

  def url_params
    params.require(:url).permit(:target_url)
  end
end
