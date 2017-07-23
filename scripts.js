var ideaArray = [];
$('.idea-stream').on('click', '#upvote-button', upVote);
$('.idea-stream').on('click', '#downvote-button', downVote);

$(document).ready(function() {
  getIdeaFromStorage();
});

$("#idea-body, #idea-title").keyup(function() {
  if (($("#idea-title").val() !== "") || ($("#idea-body").val() !== "")) {
    $("#save-button").removeAttr("disabled");
  }
});

$("#save-button").on('click', function(event) {
  event.preventDefault();
  evalInputs();
  $("#save-button").attr("disabled", "disabled");
});

$(".idea-stream").on('click', ".delete-button", function() {
  $(this).closest('.idea-card').remove();
});

$(document).on('click', ".delete-button", function() {
  $(this).closest('.idea-card').remove();
});

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

function downVote() {
  var ideaID = $(this).closest('.idea-card').prop('id');
  console.log(ideaID);
  var index = ideaArray.findIndex(function (element){
      return element.id == ideaID;
    })
  console.log(index)
  if (ideaArray[index].status === "genius"){
    ideaArray[index].status = "plausible";
    $(this).siblings('h3').find('.idea-quality').text("plausible")
  } else if (ideaArray[index].status === "plausible"){
    ideaArray[index].status = "swill";
    $(this).siblings('h3').find('.idea-quality').text("swill")
  }
  sendIdeaToStorage();
}

function upVote() {
  var ideaID = $(this).closest('.idea-card').prop('id');
  console.log(ideaID);
  var index = ideaArray.findIndex(function (element){
      return element.id == ideaID;
    })
  if (ideaArray[index].status === "swill"){
    ideaArray[index].status = "plausible";
    $(this).siblings('h3').find('.idea-quality').text("plausible")
  } else if (ideaArray[index].status === "plausible"){
    ideaArray[index].status = "genius";
    $(this).siblings('h3').find('.idea-quality').text("genius")
  }
  sendIdeaToStorage();
}

function FreshIdea(title, body, status) {
  this.title = title;
  this.body = body;
  this.status = "swill";
  this.id = Date.now();
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

function sendIdeaToStorage() {
  localStorage.setItem("ideaArray", JSON.stringify(ideaArray));
}

function getIdeaFromStorage() {
  if (localStorage.getItem('ideaArray')) {
    ideaArray = JSON.parse(localStorage.getItem("ideaArray"));
    ideaArray.forEach(function(element) {
      prependCard(element);
    });
  } else {
    alert('You do not have any of your shit in here');
  }
}

$('.idea-stream').on('keyup', 'h2', function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    this.blur();
  }
  var id = $(this).closest('.idea-card')[0].id;
  var title = $(this).text();
  ideaArray.forEach(function(card) {
    if (card.id == id) {
      card.title = title;
    }
  });
  sendIdeaToStorage();
});

$('.idea-stream').on('keyup', 'p', function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    this.blur();
  }
  var id = $(this).closest('.idea-card')[0].id;
  var body = $(this).text();
  ideaArray.forEach(function(card) {
    if (card.id == id) {
      card.body = body;
    }
  });
  sendIdeaToStorage();
});

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
};

$('#search-bar').on('keyup', searchIdeas);

function searchIdeas(event){
  event.preventDefault();
  var newArray = ideaArray.filter(function(element){
    return element.title.includes($('#search-bar').val()) || element.body.includes($('#search-bar').val());
  });
  $('.idea-card').remove();
  newArray.forEach( function(element){
    prependCard(element);
  });
  // we want to return any cards that match our input
  // we want to hide any cards that dont match ou.r input
}
