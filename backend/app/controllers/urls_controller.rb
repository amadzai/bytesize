class UrlsController < ApplicationController
  def shorten
    url = Url.new(
      target_url: url_params[:target_url],
      title: Urls::FetchTitle.call(url_params[:target_url]), # TODO: Make async
      short_url: Urls::GenerateShortUrl.call,
    )

    if url.save
      render json: {
        short_url: url.short_url,
        target_url: url.target_url,
        title: url.title
      }, status: :created
    else
      render json: { errors: url.errors.full_messages }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotUnique
    retry
  end

  def index # TODO: Add pagination
    urls = Url.all.order(created_at: :desc)

    render json: urls.map { |url|
      {
        short_url: url.short_url,
        target_url: url.target_url,
        title: url.title,
        click_count: url.click_count
      }
    }
  end

  def redirect
    url = Url.find_by!(short_url: params[:short_url])
    url.increment!(click_count: url.click_count + 1) # rubocop:disable Rails/SkipsModelValidations

    redirect_to url.target_url, status: :found, allow_other_host: true
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Short URL not found" }, status: :not_found
  end

  private

  def url_params
    params.require(:url).permit(:target_url)
  end
end
