Rails.application.routes.draw do
  namespace :api do
    post '/api-auth', to: 'authentication#authenticate'
    post '/create-user', to: 'user#signup'
    
    # Events
    get '/events', to: 'events#index'
    post '/events', to: 'events#create'
    get '/events/(/:id)', to: 'events#show'
    put '/events/(/:id)', to: 'events#edit'
    delete '/events/(/:id)', to: 'events#remove'
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
