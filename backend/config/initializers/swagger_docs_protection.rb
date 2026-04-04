unless Rails.env.development?
  class BlockSwaggerDocs
    def initialize(app)
      @app = app
    end

    def call(env)
      path = env["PATH_INFO"].to_s

      if path == "/swagger" || path.start_with?("/swagger/")
        return [
          404,
          { "Content-Type" => "application/json; charset=utf-8" },
          [ { error: "Not Found" }.to_json ]
        ]
      end

      @app.call(env)
    end
  end

  Rails.application.config.middleware.insert_before(ActionDispatch::Static, BlockSwaggerDocs)
end
