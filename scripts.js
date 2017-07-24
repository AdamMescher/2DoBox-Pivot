var ideaArray = [];
getIdeaFromStorage();
makeCards(ideaArray);

//EVENT LISTENERS
$('#search-bar').on('keyup', searchIdeas);
$(".idea-stream").on('click', ".delete-button", deleteCard)
$('.idea-stream').on('click', '#upvote-button', upVote);
$('.idea-stream').on('click', '#downvote-button', downVote);
$('.idea-stream').on('keyup', 'h2', editText);
$('.idea-stream').on('keyup', 'p', editText);
$("#save-button").on('click', saveCard);
$("#idea-body, #idea-title").keyup(enableButton);

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
function sendIdeaToStorage() {
  localStorage.setItem("ideaArray", JSON.stringify(ideaArray));
}

function getIdeaFromStorage() {
  if (localStorage.getItem('ideaArray')) {
    ideaArray = JSON.parse(localStorage.getItem("ideaArray"));
  }
}

// CARDS
function prependCard(idea) {
  $('.idea-stream').prepend(
    `<div class="idea-card" id="${idea.id}">
      <div class="card-title-flex">
        <h2 contenteditable=true>${idea.title}</h2>
        <img src="icons/delete.svg" class="card-buttons delete-button" />
      </div>
      <p contenteditable=true>${idea.body}</p>
      <div class="card-quality-flex quality-spacing">
        <img src="icons/upvote.svg" class="card-buttons" id="upvote-button"/>
        <img src="icons/downvote.svg"  class="card-buttons" id="downvote-button" />
        <h3>quality: <span class="idea-quality">${idea.status}</span></h3>
      </div>
    </div>`
  );
};

function makeCards(arr) {
  arr.forEach(function(element){
    prependCard(element);
  })
}

function addCard() {
  var ideaTitle = $("#idea-title").val();
  var ideaBody = $("#idea-body").val();
  var ideaStatus = "swill"
  var newIdea = new FreshIdea(ideaTitle, ideaBody, ideaStatus);
  prependCard(newIdea);
  ideaArray.push(newIdea);
  sendIdeaToStorage();
};

// SAVE BUTTON

function saveCard(event) {
  event.preventDefault();
  evalInputs();
  $("#save-button").attr("disabled", true);
}

function enableButton() {
  if (($("#idea-title").val() !== "") || ($("#idea-body").val() !== "")) {
    $("#save-button").removeAttr("disabled");
  }
}

// SEARCH BAR CALLBACK FUNCTION
function searchIdeas(event){
  event.preventDefault();
  var newArray = ideaArray.filter(function(element){
    return element.title.toLowerCase().includes($('#search-bar').val().toLowerCase()) || element.body.includes($('#search-bar').val().toLowerCase());
  });
  $('.idea-card').remove();
  newArray.forEach( function(element){
    prependCard(element);
  });
}

// DELETE BUTTON CALLBACK FUNCTION
function deleteCard() {
  var ideaID = $(this).closest('.idea-card').prop('id');
  var index = ideaArray.findIndex(function(element){
    return element.id == ideaID;
  });
  $(this).closest('.idea-card').remove();
  ideaArray.splice(index, 1);
  sendIdeaToStorage();
}

// DOWNVOTE BUTTON CALLBACK FUNCTION
function downVote() {
  var ideaID = $(this).closest('.idea-card').prop('id').toString();
  var index = ideaArray.findIndex(function(element){
    return element.id == ideaID;
  });
  if (isGenius(ideaArray[index]) === true )  {
    makePlausible(ideaArray[index]);
  } else if ( isPlausible( ideaArray[index]) === true ) {
      makeSwill(ideaArray[index]);
  }
  sendIdeaToStorage();
}

// UPVOTE BUTTON CALLBACK FUNCTION
function upVote() {
  var ideaID = $(this).closest('.idea-card').prop('id').toString();
  var index = ideaArray.findIndex(function (element){
      return element.id == ideaID;
    })
  if (isSwill(ideaArray[index]) === true){
    makePlausible(ideaArray[index]);

  } else if (isPlausible(ideaArray[index]) === true){
    makeGenius(ideaArray[index]);
  }
  sendIdeaToStorage();
}

// UPVOTE / DOWNVOTE REFACTOR FUNCTIONS
function isSwill(element) {
  return (element.status === 'swill') ? true : false;
}

function isPlausible(element) {
  return (element.status === 'plausible') ? true : false;
}

function isGenius(element) {
  return (element.status === 'genius') ? true : false;
}

function makeSwill(element) {
  element.status = 'swill';
  $('#' + element.id).find('.idea-quality').text('swill');
}

function makePlausible(element){
  element.status = "plausible";
  $('#' + element.id).find('.idea-quality').text('plausible');
}

function makeGenius(element) {
  element.status = "genius";
  $('#' + element.id).find('.idea-quality').text('genius');
}

function FreshIdea(title, body, status) {
  this.title = title;
  this.body = body;
  this.status = "swill";
  this.id = Date.now();
}

// EDIT TEXT FUNCTION

function leaveTarget(event) {
  event.preventDefault();
  $('p, h2').blur();
}

function editText(event) {
  (event.keyCode === 13) ? leaveTarget(event) : null;
  var id = $(this).closest('.idea-card')[0].id;
  var body = $(this).text();
  ideaArray.forEach(function(card) {
    if (card.id == id) {
      card.title = body;
    }
    sendIdeaToStorage();
  });
}

function editField(event) {
  event.preventDefault();
  this.blur();
}

// INPUT FIELD FUNCTIONS
function resetInputs() {
  $('#idea-title').val('');
  $('#idea-body').val('');
};

function evalInputs() {
  var ideaTitle = $("#idea-title").val();
  var ideaBody = $("#idea-body").val();
  if (!ideaTitle) {
    return alert("Please enter a title.");
  } else if (!ideaBody) {
    return alert ("Please enter something in the body.");
  } else {
    addCard();
    resetInputs();
  }
}
