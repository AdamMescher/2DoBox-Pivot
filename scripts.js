var todoArray = [];
var showCompleteTodosButtonCounter = 0;
var showMoreTodosButtonCounter = 0;
var todoCriticalFilterCounter = 0;
var todoHighFilterCounter = 0;
var todoNormalFilterCounter = 0;
var todoLowFilterCounter = 0;
var todoNoneFilterCounter = 0;

getTodoFromStorage();
makeTenCards(todoArray);

function FreshTodo(title, task, status) {
  this.title = title;
  this.task = task;
  this.status = "normal";
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
$('.show-completed-todos-button').on('click', prependCompletedTodos);
$('.todo-critical-filter-button').on('click', todoCriticalFilter);
$('.todo-high-filter-button').on('click', todoHighFilter);
$('.todo-normal-filter-button').on('click', todoNormalFilter);
$('.todo-low-filter-button').on('click', todoLowFilter);
$('.todo-none-filter-button').on('click', todoNoneFilter);
$('.show-more-todos-button').on('click', showMoreTodos);

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
    `<div class="todo-card ${todo.completed} ${todo.status}" id="${todo.id}"><div class="card-title-flex">
        <h2 class="card-title-editable" contenteditable=true>${todo.title}</h2>
        <img src="icons/delete.svg" alt="delete button gray" class="card-buttons delete-button" tabindex='0' role="button" />
      </div>
      <p class="card-task-editable" contenteditable=true>${todo.task}</p>
      <div class="card-quality-flex quality-spacing" role="presentation">
        <div class = "card-bottom-left">
          <img src="icons/upvote.svg" alt="upvote button gray" class="card-buttons" id="upvote-button" tabindex='0' role='button' />
          <img src="icons/downvote.svg" alt="downvote button gray" class="card-buttons" id="downvote-button" tabindex='0' role='button' />
          <h3 tabindex='0'>importance: <span class="todo-quality">${todo.status}</span></h3>
        </div>
          <button class="card-completed-task-button" role="button">completed task</button>
      </div>
    </div>`
  );
};

function makeTenCards(arr) {
  for(var i = arr.length - 10; i < arr.length; i++){
    if(arr[i] != undefined){
      prependCard(arr[i]);
    }
  }
}

function showAllCards() {
  removeAllCards();
  makeCards(todoArray);
}

function makeCards(arr) {
  arr.forEach(function(element){
    prependCard(element);
    removeShowAllClass();
  })
}

function removeShowAllClass() {
  $('.show-all').removeClass('show-all');
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
  evaluateImportanceDownVote(index);
  sendTodoToStorage();
}

function evaluateImportanceDownVote(index){
  if (isCritical(todoArray[index]) === true){
    makeHigh(todoArray[index]);
  } else if (isHigh(todoArray[index]) === true){
    makeNormal(todoArray[index]);
  } else if (isNormal(todoArray[index]) === true){
    makeLow(todoArray[index]);
  } else if(isLow(todoArray[index]) === true) {
    makeNone(todoArray[index]);
  }
}

// UPVOTE BUTTON CALLBACK FUNCTION
function upVote() {
  var todoID = $(this).closest('.todo-card').prop('id').toString();
  var index = todoArray.findIndex(function (element){
      return element.id == todoID;
    })
  evalueImportanceUpVote(index);
  sendTodoToStorage();
}

function evalueImportanceUpVote(index) {
  if (isNone(todoArray[index]) === true){
    makeLow(todoArray[index]);
  } else if (isLow(todoArray[index]) === true){
    makeNormal(todoArray[index]);
  } else if (isNormal(todoArray[index]) === true){
    makeHigh(todoArray[index]);
  } else if(isHigh(todoArray[index]) === true) {
    makeCritical(todoArray[index]);
  }
}

function isNone(element) {
  return element.status === 'none';
}

function isLow(element) {
  return element.status === 'low';
}

function isNormal(element) {
  return element.status === 'normal';
}

function isHigh(element) {
  return element.status === 'high';
}

function isCritical(element) {
  return element.status === 'critical';
}

function makeNone(element) {
  element.status = 'none';
  $('#' + element.id).find('.todo-quality').text('none');
  $('#' + element.id).removeClass('low');
  $('#' + element.id).addClass('none');
}

function makeLow(element) {
  element.status = 'low';
  $('#' + element.id).find('.todo-quality').text('low');
  $('#' + element.id).removeClass('none');
  $('#' + element.id).removeClass('normal');
  $('#' + element.id).addClass('low');
}

function makeNormal(element) {
  element.status = 'normal';
  $('#' + element.id).find('.todo-quality').text('normal');
  $('#' + element.id).removeClass('low');
  $('#' + element.id).removeClass('high');
  $('#' + element.id).addClass('normal');
}

function makeHigh(element){
  element.status = "high";
  $('#' + element.id).find('.todo-quality').text('high');
  $('#' + element.id).removeClass('normal');
  $('#' + element.id).removeClass('critical');
  $('#' + element.id).addClass('high');
}

function makeCritical(element) {
  element.status = "critical";
  $('#' + element.id).find('.todo-quality').text('critical');
  $('#' + element.id).removeClass('high');
  $('#' + element.id).addClass('critical');
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
    if (card.id == id && card.completed === false) {
      markCompletedCardCompletedIsFalse(card, id);
      return;
    } else if (card.id == id && card.completed === true){
      markCompletedCardCompletedIsTrue(card, id);
    }
  })
  sendTodoToStorage();
}

function markCompletedCardCompletedIsFalse(card, id) {
  console.log(card);
  card.completed = true;
  $('#' + id).addClass('true show-all');
  $('#' + id).removeClass('false');
}

function markCompletedCardCompletedIsTrue(card, id) {
  card.completed = false;
  $('#' + id).removeClass('true');
  $('#' + id).addClass('false');
}

function prependCompletedTodos(){
  var completedTodosArray = todoArray.filter(function(element){
    return element.completed === true;
  })
  var uncompletedTodosArray = todoArray.filter(function(element){
    return element.completed === false;
  })

  showCompleteTodosButtonCounter++;
  if(showCompleteTodosButtonCounter % 2 === 1){
    showCompleteTodsButtonCounterIsOdd(completedTodosArray, uncompletedTodosArray)
  }
  else $('.todo-card').toggleClass('show-all');
}

function showCompleteTodsButtonCounterIsOdd(completed, uncompleted) {
  removeAllCards();
  makeCards(uncompleted);
  makeCards(completed);
  $('.todo-card').toggleClass('show-all');
}

function showMoreTodos() {
  showMoreTodosButtonCounter ++;
  if(showMoreTodosButtonCounter % 2 === 0) {
    removeAllCards();
    makeTenCards(todoArray);
  }
  else {
    showAllCards();
  }
}

function todoCriticalFilter(){
  todoCriticalFilterCounter ++;
  if(todoCriticalFilterCounter % 2 === 1){
    $('.critical').removeClass('hidden');
    $('.high, .normal, .low, .none').addClass('hidden');
  } else {
    $('.todo-card').removeClass('hidden');
  }
}

function todoHighFilter() {
  todoHighFilterCounter ++;
  if(todoHighFilterCounter % 2 === 1){
    $('.high').removeClass('hidden');
    $('.critical, .normal, .low, .none').addClass('hidden');
  } else {
    $('.todo-card').removeClass('hidden');
  }
}

function todoNormalFilter() {
  todoNormalFilterCounter ++;
  if(todoNormalFilterCounter % 2 === 1){
    $('.normal').removeClass('hidden');
    $('.critical, .high, .low, .none').addClass('hidden');
  } else {
    $('.todo-card').removeClass('hidden');
  }
}

function todoLowFilter() {
  todoLowFilterCounter ++;
  if(todoLowFilterCounter % 2 === 1){
    $('.low').removeClass('hidden');
    $('.critical, .high, .normal, .none').addClass('hidden');
  } else {
    $('.todo-card').removeClass('hidden');
  }
}

function todoNoneFilter() {
  todoNoneFilterCounter ++;
  if(todoNoneFilterCounter % 2 === 1){
    $('.none').removeClass('hidden');
    $('.critical, .high, .normal, .low').addClass('hidden');
  } else {
    $('.todo-card').removeClass('hidden');
  }
}
