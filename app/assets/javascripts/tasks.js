$(function() {

  // The taskHtml method takes in a JavaScript representation
  // of the task and produces an HTML representation using
  // <li> tags    
  function taskHtml(task) {
    var liClass = task.done ? "completed" : "";
    var checkedStatus = task.done ? "checked" : "";
    var liElement = '<li id="' + task.id +'" class="' + liClass + '">' + 
      '<div class = "view"><input class = "toggle" type = "checkbox" data-id = "' +
      task.id +
      '"' +
      checkedStatus + 
      '><label>' + 
      task.title + 
      '</label><button class = "destroy" data-id = "' + task.id +'"></button></div></li>';

    return liElement;
  }

  //on submit, prevent reload, then send a JSON request to the create function
  //with the data to submit. Then append it to the current html
  // and allow for toggling and deletion and clear the text field
  $('#new-form').submit(function(event) {
    event.preventDefault();
    var newTodo = $('.new-todo').val();
    var payload = {
      task: {
        title: newTodo
      }
    };
    $.post("/tasks", payload).success(function(data) {
      var htmlString = taskHtml(data);
      var ulTodos = $('.todo-list');
      ulTodos.append(htmlString);
      $('.toggle').click(toggleTask);
      $('.destroy').click(deleteTask);
      var message = ''
      $('.new-todo').val(message);
    });
  });

  function toggleTask(e) {
    //toggleTask takes the id and checked status of the clicked item
    //and puts it into the correct format for a JSON API request to
    //update the done status of the item
    var itemId = $(e.target).data("id");
    var doneValue = Boolean($(e.target).is(':checked'));
    $.post("/tasks/" + itemId, {
      _method: "PUT",
      task: {
      done: doneValue
      }
    }).success(function(data) {
      var liHtml = taskHtml(data);
      var $li = $("#" + data.id);
      $li.replaceWith(liHtml);
      $('.toggle').change(toggleTask);
      $('.destroy').click(deleteTask);
    })
  }

  function deleteTask(e) {
    //deleteTask takes the id of the clicked item and sends a delete
    //JSON API request to delete it from the database, and visually remove it from html
    //note: for speed, the deletion is triggered without a success method, so on reload, if unsuccessful, it may still be there
    var itemId = $(e.target).data("id");
    $.post("/tasks/" + itemId, {
      _method: "DELETE",
    });

    var $li = $("#" + itemId);
    $li.remove();
  }

  $.get("/tasks").success( function ( data ) {
    var htmlString = "";
    $.each(data, function(index, task) {
      htmlString += taskHtml(task)
    });
    var ulTodos = $('.todo-list');
    ulTodos.html(htmlString);
    $('.toggle').change(toggleTask);
    $('.destroy').click(deleteTask);
  });


  $('.clear-completed').click(clearCompleted);
  function clearCompleted(tasks) {
    //finds all html elements with acompleted class, and iterates thorough them
    //deletes each one and removes visually
    //potential for refactor by creating a generic delete method?
    var completed = $("ul.todo-list").find(".completed");
    $.each(completed, function(index, task) {
      $.post("/tasks/" + task.id, {
        _method: "DELETE",
      });

      var $li = $("#" + task.id);
      $li.remove();
    })
  }
});