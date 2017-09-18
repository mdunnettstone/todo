  $(function() {

    // The taskHtml method takes in a JavaScript representation
    // of the task and produces an HTML representation using
    // <li> tags    
    function taskHtml(task) {
      var liClass = task.done ? "completed" : "";
      var checkedStatus = task.done ? "checked" : "";
      var liElement = '<li class = "' + liClass + '"' + '>' + 
        '<div class = "view"><input class = "toggle" type = "checkbox" data-id = "' +
        task.id +
        '"' +
        checkedStatus + 
        '><label>' + 
        task.title + 
        '</label></div></li>';

      return liElement;
    }

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
        var message = ''
        var message1 = "Added :)"
        setTimeout(message1, 1000)
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
      });
    }

    $.get("/tasks").success( function ( data ) {
      var htmlString = "";
      $.each(data, function(index, task) {
        htmlString += taskHtml(task)
      });
      var ulTodos = $('.todo-list');
      ulTodos.html(htmlString);
      $('.toggle').change(toggleTask);
    });
  });