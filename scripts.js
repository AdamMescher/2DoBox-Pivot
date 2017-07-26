var todoArray = [];
getTodoFromStorage();
makeCards(todoArray);

function FreshTodo(title, task, status) {
  this.title = title;
  this.task = task;
  this.status = "swill";
  this.id = Date.now();
  this.completed = false;
}

//EVENT LISTENERS
$('#filter-bar').on('keyup', searchtodos);
$(".todo-stream").on('click', ".delete-button", deleteCard)
$('.todo-stream').on('click', '#upvote-button', upVote);
$('.todo-stream').on('click', '#downvote-button', downVote);
$('.todo-stream').on('keyup', '.card-title-editable', editTitle);
$('.todo-stream').on('keyup', '.card-task-editable', editTask);
$("#save-button").on('click', saveButton);
$("#todo-task, #todo-title").keyup(enableButton);
$(".todo-stream").on('click', '.card-completed-task-button', markCompleted);

// HOVER CHANGE IMAGE FUNCTIONS

$(document).on('mouseenter', '.delete-button', function() {
  $(this).attr('src', 'icons/delete-hover.svg');
});

$(document).on('mouseleave', '.delete-button', function() {
  $(this).attr('src', 'icons/delete.svg');
});

$(document).on('mouseenter', '#upvote-button', function() {
  $(this).attr('src', 'icons/upvote-hover.svg');
});

$(document).on('mouseleave', '#upvote-button', function() {
  $(this).attr('src', 'icons/upvote.svg');
});

$(document).on('mouseenter', '#downvote-button', function() {
  $(this).attr('src', 'icons/downvote-hover.svg');
});

$(document).on('mouseleave', '#downvote-button', function() {
  $(this).attr('src', 'icons/downvote.svg');
});

// LOCALSTORAGE
function sendTodoToStorage() {
  localStorage.setItem("todoArray", JSON.stringify(todoArray));
}

function getTodoFromStorage() {
  if (localStorage.getItem('todoArray')) {
    todoArray = JSON.parse(localStorage.getItem("todoArray"));
  }
}

// CARDS
function prependCard(todo) {
  $('.todo-stream').prepend(
    `<div class="todo-card ${todo.completed}" id="${todo.id}"><div class="card-title-flex">
        <h2 class="card-title-editable" contenteditable=true>${todo.title}</h2>
        <img src="icons/delete.svg" class="card-buttons delete-button" />
      </div>
      <p class="card-task-editable" contenteditable=true>${todo.task}</p>
      <div class="card-quality-flex quality-spacing">
        <div class = "card-bottom-left">
          <img src="icons/upvote.svg" class="card-buttons" id="upvote-button"/>
          <img src="icons/downvote.svg" class="card-buttons" id="downvote-button" />
          <h3>quality: <span class="todo-quality">${todo.status}</span></h3>
        </div>
          <button class="card-completed-task-button">completed task</button>
      </div>
    </div>`
  );
};

function makeCards(arr) {
  arr.forEach(function(element){
    prependCard(element);
  })
  checkIfCompleted();
  // check if completed === true
}

function checkIfCompleted(){
  todoArray.forEach(function(card) {
    if (card.completed === true) {
      console.log($(this));
      // $(this).parent().parent().toggleClass('grey-out');
    }
  })
}



function addCard() {
  var newTodo = new FreshTodo($('#todo-title').val(), $('#todo-task').val());
  prependCard(newTodo);
  todoArray.push(newTodo);
  sendTodoToStorage();
};

// SAVE BUTTON
function saveButton(event) {
  event.preventDefault();
  addCard();
  resetInputs();
  disableSaveButton();
  refocusTitleInput();
}

function enableButton() {
  if (($("#todo-title").val() !== "") && ($("#todo-task").val() !== "")) {
    reenableSaveButton();
  } else{
    disableSaveButton();
  }
}

function reenableSaveButton() {
  $("#save-button").removeAttr("disabled");
}

function disableSaveButton() {
  $("#save-button").attr("disabled", true);
}

function refocusTitleInput() {
  $('#todo-title').focus();
}

// SEARCH BAR CALLBACK FUNCTION
function searchtodos(event){
  event.preventDefault();
  removeAllCards();
  foundSearchTodos().forEach( function(element){
    prependCard(element);
  });
}

function removeAllCards() {
  $('.todo-card').remove();
}

function foundSearchTodos() {
  return todoArray.filter(function(element){
    return element.title.toLowerCase().includes($('#filter-bar').val().toLowerCase()) || element.task.includes($('#filter-bar').val().toLowerCase());
  });
}

// DELETE BUTTON CALLBACK FUNCTION
function deleteCard() {
  var todoID = $(this).closest('.todo-card').prop('id');
  var index = todoArray.findIndex(function(element){
    return element.id == todoID;
  });
  $(this).closest('.todo-card').remove();
  removeItemFromArray(index);
  sendTodoToStorage();
}

function removeItemFromArray(i) {
  todoArray.splice(i, 1);
}

// DOWNVOTE BUTTON CALLBACK FUNCTION
function downVote() {
  var todoID = $(this).closest('.todo-card').prop('id').toString();
  var index = todoArray.findIndex(function(element){
    return element.id == todoID;
  });
  if (isGenius(todoArray[index]) === true )  {
    makePlausible(todoArray[index]);
  } else if ( isPlausible( todoArray[index]) === true ) {
      makeSwill(todoArray[index]);
  }
  sendTodoToStorage();
}

// UPVOTE BUTTON CALLBACK FUNCTION
function upVote() {
  var todoID = $(this).closest('.todo-card').prop('id').toString();
  var index = todoArray.findIndex(function (element){
      return element.id == todoID;
    })
  if (isSwill(todoArray[index]) === true){
    makePlausible(todoArray[index]);

  } else if (isPlausible(todoArray[index]) === true){
    makeGenius(todoArray[index]);
  }
  sendTodoToStorage();
}

function isSwill(element) {
  return element.status === 'swill';
}

function isPlausible(element) {
  return element.status === 'plausible';
}

function isGenius(element) {
  return element.status === 'genius';
}

function makeSwill(element) {
  element.status = 'swill';
  $('#' + element.id).find('.todo-quality').text('swill');
}

function makePlausible(element){
  element.status = "plausible";
  $('#' + element.id).find('.todo-quality').text('plausible');
}

function makeGenius(element) {
  element.status = "genius";
  $('#' + element.id).find('.todo-quality').text('genius');
}

// EDIT TEXT FUNCTION
function leaveTarget() {
  event.preventDefault();
  $('.card-task-editable, .card-title-editable').blur();
}

function editTitle(event) {
  (event.keyCode === 13) ? leaveTarget(event) : null;
  var id = $(this).closest('.todo-card')[0].id;
  var title = $(this).text();
  todoArray.forEach(function(card) {
    if (card.id == id) {
      card.title = title;
    }
    sendTodoToStorage();
  });
}

function editTask(event) {
  (event.keyCode === 13) ? leaveTarget(event) : null;
  var id = $(this).closest('.todo-card')[0].id;
  var task = $(this).text();
  todoArray.forEach(function(card) {
    if (card.id == id) {
      card.task = task;
    }
    sendTodoToStorage();
  });
}

function editField(event) {
  event.preventDefault();
  this.blur();
}

// INPUT FIELD FUNCTIONS
function resetInputs() {
  $('#todo-title').val('');
  $('#todo-task').val('');
};

function markCompleted(){
  var id= $(this).closest('.todo-card')[0].id;
  todoArray.forEach(function(card) {
    if (card.id == id) {
      card.completed = true;
    }
  })
  $(this).parent().parent().toggleClass('grey-out');
  sendTodoToStorage();
}
