class Api::EventsController < ApplicationController
    def index
        render json: @current_user.events.order(:timestamps).map { |event|
            if event.thumbnail.attached?
                event.as_json.merge(thumbnail: url_for(event.thumbnail))
            else
                event.as_json.merge(thumbnail: "")
            end
        } 
    end

    def show
        @event = @current_user.events.find_by_id(params[:id])
        if @event
            if @event.thumbnail.attached?
                render json: @event.as_json.merge(thumbnail: url_for(@event.thumbnail))
            else
                render json: @event.as_json.merge(thumbnail: "")
            end
        else
            render json: { msg: "Event not found" }, status: 400
        end
    end
    
    def create
        @event = @current_user.events.create(event_params)
        
        if @event.errors.count > 0
            render json: @event.errors, status: 400
        else
            render json: @event.as_json.merge(thumbnail: url_for(@event.thumbnail))
        end
    end

    def edit
        @event = @current_user.events.find_by_id(params[:id])
        if @event.update(event_params)
            if @event.thumbnail.attached?
                render json: @event.as_json.merge(thumbnail: url_for(@event.thumbnail))
            else
                render json: @event.as_json.merge(thumbnail: "")
            end
        else
            render json: @event.errors, status: 400
        end
    end

    def remove
        @event = @current_user.events.find_by_id(params[:id])
        if @event.delete
            render json: { deleted: @event }
        else
            render json: @event.errors, status: 400
        end
    end

    private

    def event_params
        params.permit(:event_name, :event_category, :event_place, :event_address, :event_initial_date, :event_final_date, :event_type, :thumbnail)
    end
end