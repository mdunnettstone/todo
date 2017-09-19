class TasksController < ApplicationController
  def index
    render json: current_user.tasks.order(:id)
  end

  def update
    task = Task.find(params[:id])
    task.update_attributes(task_params)
    render json: task
  end

  def create
    task = current_user.tasks.create(task_params)
    render json: task
  end

  def destroy
    task = Task.find(params[:id])
    task.delete
  end

  private

  def task_params
    params.require(:task).permit(:done, :title)
  end
end
