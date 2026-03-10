class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :trackable, :omniauthable

  has_many :languages, dependent: :destroy
  has_many :words, dependent: :destroy
  has_many :stashes, dependent: :destroy
  has_many :practice_sessions, dependent: :destroy
end
