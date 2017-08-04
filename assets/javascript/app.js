$(document).ready(function(){
  $("#timeron").toggle();
  $(".progress").toggle();
  $("#question").toggle();
  $(".card-tabs").toggle();
  $("#stop").toggle();
  $("#cooldown").toggle();
  var qIndex = 0;
  var timer = 0;
  var qObj = {
    0: { "question": "Who?",
    "opt1": "Me.",
    "opt2": "You.",
    "opt3": "Him.",
    "opt4": "Her.",
    "ans": "1",
    "gif": "none" },
    1: { "question": "When?",
    "opt1": "Now.",
    "opt2": "Then.",
    "opt3": "Before",
    "opt4": "Coming up soon.",
    "ans": "3",
    "gif": "none" },
    2: { "question": "Where?",
    "opt1": "Across the way.",
    "opt2": "In the cut.",
    "opt3": "Where you least expect it.",
    "opt4": "Here.",
    "ans": "2",
    "gif": "none" } };
  var score = {
    "right": 0,
    "wrong": 0,
    "other": 0 };
  var intervalId;
  $("qnum").text(qIndex+1);

  var nextQuestion() {

    qIndex++;
    if ( qIndex >= qObj.length ) {
      $("#timeron").toggle();
      $("#timeroff").toggle();
      $("#timer").text("0");
      $("#cooldownscore").text("GAME OVER! Correct: " + score.right + ", Wrong: " + score.wrong + ", Unanswered: " + score.other + "."
      $("#start").toggle();
      $("#end").toggle();
      qIndex = 0;
      $("#qnum").text("0");
      clearInterval(intervalId);
    } else {
      $("#qnum").text(qIndex+1);
      $("#question").text(qObj[qIndex]["question"]);
      $("#opt1").text(qObj[qIndex]["opt1"]);
      $("#opt2").text(qObj[qIndex]["opt2"]);
      $("#opt3").text(qObj[qIndex]["opt3"]);
      $("#opt4").text(qObj[qIndex]["opt4"]);
      $("#question").data("ans", qObj[qIndex]["ans"]);
      $("#cooldown").toggle();
      $(".progress").toggle();
      $("#question").toggle();
      $(".card-tabs").toggle();
      timer = 20;
      $("#timer").text(timer);
      intervalId = setInterval(1000, qTick);
    }
  }
  var qTick = function() {
    timer--;
    $("timer").text(timer);
    if (timer <= 0) {
      clearInterval(intervalId);
      score.other++;
      $(".progress").toggle();
      $("#question").toggle();
      $(".card-tabs").toggle();
      $("#cooldownscore").text("Ran out of time.  Next question in 5 seconds."};
      $("#cooldown").toggle();
      intervalId = setTimeout(5000, nextQuestion);
    }
  }
  $("#start").on("click", function(event){
    $("#cooldown").toggle();
    $("#start").toggle();
    $("#stop").toggle();
    $("#timeron").toggle();
    $("#timeroff").toggle();
    $("#qnum").text(qIndex+1)
    intervalId = setTimeout(5000, function(){
      $("#cooldown").toggle();
      $(".progress").toggle();
      $("#question").text(qObj[qIndex]["question"]);
      $("#opt1").text(qObj[qIndex]["opt1"]);
      $("#opt2").text(qObj[qIndex]["opt2"]);
      $("#opt3").text(qObj[qIndex]["opt3"]);
      $("#opt4").text(qObj[qIndex]["opt4"]);
      $("#question").data("ans", qObj[qIndex]["ans"]);
    });

  });
  $("#stop").on("click", function(event){
    clearInterval(intervalId);
    $(".progress").toggle();
    $("#question").toggle();
    $(".card-tabs").toggle();
    $("#cooldownscore").text("Stopped.");
  });
  $(".collection-item").on("click", function(event) {
    if (self.id == "opt"+$("#question").data("ans")) {
      //correct
    } else {
      //wrong
    }
  });

});
