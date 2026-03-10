class StashesController < ApplicationController
  before_action :authenticate_user!

  def index
    stashes = current_user.stashes.order(:name)
    if params[:q].present?
      stashes = stashes.where("name ILIKE ?", "%#{params[:q]}%")
    end
    render json: stashes.select(:id, :name, :color).map { |s| { id: s.id, name: s.name, color: s.color } }
  end

  def create
    @stash = current_user.stashes.build(stash_params)
    if @stash.save
      render json: { id: @stash.id, name: @stash.name, color: @stash.color }, status: :created
    else
      render json: { errors: @stash.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    stash = current_user.stashes.find(params[:id])
    stash.destroy
    redirect_back fallback_location: words_path, notice: "Stash \"#{stash.name}\" removed."
  end

  private

  def stash_params
    params.require(:stash).permit(:name, :description, :color)
  end
end
