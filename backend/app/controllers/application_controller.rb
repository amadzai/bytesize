class ApplicationController < ActionController::API
  include Pagy::Method

  RATE_LIMIT_EXCEEDED = -> {
    render json: { error: "Rate limit exceeded. Try again later." }, status: :too_many_requests
  }
end
