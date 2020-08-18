class User < ApplicationRecord
    validates :email, uniqueness: {message: 'Email already in use.'}
    validates :username, uniqueness: {message: 'Username already in use.'}
    has_many :events
    has_secure_password
end
