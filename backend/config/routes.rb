Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  post "urls/shorten", to: "urls#shorten"
  get "urls", to: "urls#index"
  get "urls/:short_url", to: "urls#redirect", as: :url_redirect
end
