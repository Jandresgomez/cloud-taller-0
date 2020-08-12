class Api::UserController < ApplicationController
    skip_before_action :authenticate_request

    def signup
        @user = User.new(user_params)
        if @user.save
            render json: @user
        else
            render json: @user.errors
        end
    end

    private

    def user_params
        params.permit(:username, :password, :first_name, :last_name, :email)
    end
end