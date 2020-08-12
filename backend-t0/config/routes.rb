Rails.application.routes.draw do
  namespace :api do
    post '/api-auth', to: 'authentication#authenticate'
    post '/create-user', to: 'user#signup'
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
