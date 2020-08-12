class Api::UserController < ApplicationController
    skip_before_action :authenticate_request

    def signup
        @user = User.new(user_params)
        render json: @user.errors unless @user.save
    end

    private

    def user_params
        params.permit(:username, :password, :first_name, :last_name, :email)
    end
end