class LanguagesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_language, only: [:update, :destroy]

  def index
    @languages = current_user.languages
    @standard_languages = YAML.load_file(Rails.root.join("config/languages.yml"))
    @existing_codes = @languages.where(custom: false).pluck(:code)
  end

  def sort
    ids = params[:language_ids]
    ids.each_with_index do |id, index|
      current_user.languages.where(id: id).update_all(position: index)
    end
    head :ok
  end

  def create
    if params[:language][:custom] == "true"
      @language = current_user.languages.build(custom_language_params.merge(custom: true))
    else
      std = YAML.load_file(Rails.root.join("config/languages.yml")).find { |l| l["code"] == params[:language][:code] }
      return head :unprocessable_entity unless std

      @language = current_user.languages.build(
        name: std["name"],
        code: std["code"],
        native_name: std["native_name"],
        proficiency: params[:language][:proficiency] || "beginner",
        custom: false
      )
    end

    @language.position = current_user.languages.maximum(:position).to_i + 1

    if @language.save
      redirect_to languages_path, notice: "#{@language.name} added to your languages."
    else
      redirect_to languages_path, alert: @language.errors.full_messages.join(", ")
    end
  end

  def update
    if @language.update(update_language_params)
      redirect_to languages_path, notice: "#{@language.name} updated."
    else
      redirect_to languages_path, alert: @language.errors.full_messages.join(", ")
    end
  end

  def destroy
    name = @language.name
    @language.destroy
    redirect_to languages_path, notice: "#{name} removed from your languages."
  end

  private

  def set_language
    @language = current_user.languages.find(params[:id])
  end

  def custom_language_params
    params.require(:language).permit(:name, :native_name, :proficiency)
  end

  def update_language_params
    params.require(:language).permit(:proficiency, :active)
  end
end
