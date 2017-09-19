class StaticPagesController < ApplicationController
  before_action :authenticate_user!, only: [:index]
  def index
    
  end

  def home
    if user_signed_in? 
      redirect_to list_path
    else
    end
  end
end
