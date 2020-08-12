class Event < ApplicationRecord
    NON_VALIDATABLE_ATTRS = ["id", "created_at", "updated_at","thumbnail"] #or any other attribute that does not need validation
    VALIDATABLE_ATTRS = Event.attribute_names.reject{|attr| NON_VALIDATABLE_ATTRS.include?(attr)}

    validates_presence_of VALIDATABLE_ATTRS
    validate :validateCategory
    validate :validateType
    belongs_to :user

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
