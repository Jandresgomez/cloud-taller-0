class Api::EventsController < ApplicationController
    def index
        render json: @current_user.events.order(:timestamps)
    end

    def show
        @event = @current_user.events.find_by_id(params[:id])
        render json: @event
    end
    
    def create
        @event = @current_user.events.create(event_params) 
        if @event.errors
            render json: @event.errors
        else
            render json: @event
        end
    end

    def edit
        @event = @current_user.events.find_by_id(params[:id])
        if @event.update(event_params)
            render json: @event
        else
            render json: @event.errors
        end
    end

    def remove
        @event = @current_user.events.find_by_id(params[:id])
        if @event.delete
            render json: { deleted: @event }
        else
            render json: @event.errors
        end
    end

    private

    def event_params
        params.permit(:event_name, :event_category, :event_place, :event_address, :event_initial_date, :event_final_date, :event_type, :thumbnail)
    end
end