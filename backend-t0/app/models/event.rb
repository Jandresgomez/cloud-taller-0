class Event < ApplicationRecord
    
    NON_VALIDATABLE_ATTRS = ["id", "created_at", "updated_at"] #or any other attribute that does not need validation
    VALIDATABLE_ATTRS = Event.attribute_names.reject{|attr| NON_VALIDATABLE_ATTRS.include?(attr)}

    has_one_attached :thumbnail
    validates_presence_of VALIDATABLE_ATTRS
    validate :validThumbnail
    validate :validateCategory
    validate :validateType
    belongs_to :user

    def validThumbnail
        unless thumbnail.attached?
            errors.add(:base, "Event has to have a thumbnail")
        end
    end

    def validateCategory
        unless ["COURSE", "CONGRESS", "SEMINAR", "CONFERENCE"].include?(event_category)
            errors.add(:base, "Not a valid event category") 
        end
    end
    
    def validateType
        unless ["VIRTUAL", "PRESENCIAL"].include?(event_type)     
            errors.add(:base, "Not a valid event type")
        end
    end
end