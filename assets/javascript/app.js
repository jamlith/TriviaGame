$(document).ready(function(){
  // hide everything but the cooldown pane
  $("#timeron").hide();
  $("#timeroff").show();
  $(".progress").hide();
  $("#question").hide();
  $(".card-tabs").hide();
  $("#stop").hide();
  $("#start").show();
  $("#cooldown").hide();
  $("#gifholder").hide();

  // set variables and set up the questions object
  var qIndex = 0;
  var qTotal = 20;
  var timer = 0;
  var intervalId;
  var buttonLock = 0;
  var right;
  var wrong;
  var ans;
  var qObj = [];
  var XHR = $.get("https://opentdb.com/api.php?amount=20&category=32&difficulty=easy&type=multiple")
    .done(function(data) {
      for (var x = 0; x < data.results.length; x++){
        var correctIndex = Math.ceil(Math.random() * 4);
        var op = [];
        var qst = data.results[x].question;
        var wrongarr = data.results[x].incorrect_answers;
        for (var i = 1; i <= 4; i++) {
          if (i === correctIndex) {
            op[i] = data.results[x].correct_answer;
          } else {
            op[i] = wrongarr.pop()
          }
        }
        qObj[x] = [];
        qObj[x]["question"] = qst.replace(/&#?[a-z0-9]+;/g, "");
        qObj[x]["opt1"] = op[1].replace(/&#?[a-z0-9]+;/g, "");
        qObj[x]["opt2"] = op[2].replace(/&#?[a-z0-9]+;/g, "");
        qObj[x]["opt3"] = op[3].replace(/&#?[a-z0-9]+;/g, "");
        qObj[x]["opt4"] = op[4].replace(/&#?[a-z0-9]+;/g, "");
        qObj[x]["ans"] = "opt" + correctIndex;
        qObj[x]["right"] = "Correct!";
        qObj[x]["wrong"] = "Wrong! The correct answer was " + data.results[x].correct_answer.replace(/&#?[a-z0-9]+;/g, "") + ".";
        qObj[x]["gif"] = "none";
      }
    });
  /*
  var qObj = {
    0: { "question": "Who?",
    "opt1": "Me.",
    "opt2": "You.",
    "opt3": "Him.",
    "opt4": "Her.",
    "ans": "opt1",
    "right": "OF COURSE! It's always me.",
    "wrong": "WRONG!  The correct answer was me!",
    "gif": "none" },
    1: { "question": "When?",
    "opt1": "Now.",
    "opt2": "Then.",
    "opt3": "Before",
    "opt4": "Coming up soon.",
    "ans": "opt1",
    "right": "Correct.  Now is always the time.",
    "wrong": "Incorrect... The correct answer was Now... There is only now, and everything else is just an abstract lie.",
    "gif": "none" },
    2: { "question": "Where?",
    "opt1": "Across the way.",
    "opt2": "In the DM.",
    "opt3": "Where you least expect it.",
    "opt4": "Here.",
    "ans": "opt2",
    "right": "Correct!  Also, I bees in the trap.",
    "wrong": "Wrong.  It always goes down in the DM",
    "gif": "none" }
  };
  */
  var score = {
    "right": 0,
    "wrong": 0,
    "other": 0
  };
  // populate what you can...
  $("#qtotal").text(qTotal);

  // set up functions for populating the question/answer fields
  function getQuestion() {
    if (qIndex < qTotal) {
      $("#question").text(qObj[qIndex]["question"]);
      $("#opt1").text(qObj[qIndex]["opt1"]);
      $("#opt2").text(qObj[qIndex]["opt2"]);
      $("#opt3").text(qObj[qIndex]["opt3"]);
      $("#opt4").text(qObj[qIndex]["opt4"]);
      $("#question").data("ans", qObj[qIndex]["ans"]);
      $("#question").data("right", qObj[qIndex]["right"]);
      $("#question").data("wrong", qObj[qIndex]["wrong"]);
      $("#qnum").text(qIndex+1);
    } else {
      endGame();
    }
  }

  function coolDown(msg) {
    // Hide question, populate it with the next obj's data,
    // show a 5 second intermission, include a gif and a
    // sentence or two correcting the user's last choice, or
    // praising their l33t correctness
    $("#timeron").show();
    $("#timeroff").hide();
    $(".progress").show();
    $("#stop").show();
    $("#start").hide();
    $("#cooldownscore").text(msg);
    $("#cooldown").show();
    $("#gifholder").hide();
    timer = 15;
    $("#timer").text(timer);
    intervalId = setTimeout(function() {
      if (qIndex >= qTotal) {
        endGame();
        return true;
      }
      $(".collection-item").removeClass("active");
      getQuestion();
      $("#cooldown").hide();
      $(".progress").show();
      $("#question").show();
      $(".card-tabs").show();
      intervalId = setInterval(timerTick, 1000);
    }, 7000)
  }

  function endGame() {
    // TODO: add a game over gif
     clearInterval(intervalId);
     qIndex = 0;
    $("#timeron").hide();
    $("#timeroff").show();
    $(".progress").hide();
    $("#question").hide();
    $(".card-tabs").hide();
    $("#stop").hide();
    $("#start").show();
    $("#cooldown").show();
    $("#gifholder").hide();
    $(".collection-item").removeClass("active");
    var remaining = qTotal - score["right"] - score["wrong"];
    $("#cooldownscore").text("GAME OVER! You got " + score["right"] + " of " + qTotal + " questions correct, with " + remaining + " questions unanswered.");
    score["right"] = 0;
    score["wrong"] = 0;
    score["other"] = 0;
    timer = 0;
    $("#qnum").text(qIndex+1);
  }

  function timerTick() {
    timer--;
    $("#timer").text(timer);
    if (timer <= 0) {
      clearInterval(intervalId);
      buttonLock = 1;
      qIndex++;
      setTimeout(function() {
        $(".collection-item").removeClass("active");
        $("#question").fadeOut();
        $(".card-tabs").fadeOut();
        buttonLock = 0;
      }, 6000);
      $("#" + $("#question").data("ans")).addClass("active");
      coolDown("You timed out.  I highlighted the correct answer above.");
    }
  }

  $(".collection-item").click(function() {
    if (buttonLock != 0) {
      return true;
    }
    clearInterval(intervalId);
    buttonLock = 1;
    $(".progress").hide();
    qIndex++
    setTimeout(function() {
      $(".collection-item").removeClass("active");
      $("#question").fadeOut();
      $(".card-tabs").fadeOut();
      buttonLock = 0;
    }, 6000);
    if (this.id === $("#question").data("ans")) {
      score["right"] = score["right"] + 1;
      $("#" + $("#question").data("ans")).addClass("active");
      coolDown($("#question").data("right"));
    } else {
      score["wrong"] = score["wrong"] + 1;
      $("#" + $("#question").data("ans")).addClass("active");
      coolDown($("#question").data("wrong"));
    }
  });

  $("#start").click(function(event) {
    coolDown("Get Ready! The game will begin shortly...");
  });

  $("#stop").on("click", function(event){
    clearInterval(intervalId);
    endGame();
  });


});
