$(document).ready(function() {
  $(".inputmenu").click(function() {
    $(".secMenucontent-widget").show();
  });

  $(".closeBtn").click(function() {
    $(".secMenucontent-widget").hide();
  });
  //   $(".inputmenu").click(function() {
  //     $(".secMenucontent-widget").hide();
  //   });

  $(".jubi-menu-val").click(function() {
    $(".secMenucontent-widget").hide();
  });
  $(".pm-sec_chatbody").click(function() {
    $(".secMenucontent-widget").hide();
  });
  $("#jubi-answerBottom").click(function() {
    $(".secMenucontent-widget").hide();
  });
  $(".closeBotImg").click(function() {
    $(".dropdown-header").toggle();
  });
  $("#jubi-answerBottom").click(function() {
    $(".voiceIcon").hide();
    $("#voice-buttons").hide();
    $("#jubi-bottomClick").show();
    $("#jubi-bottomClick").attr("style", "display: block !important");
  });
  $("body").on("focusout", "#jubi-answerBottom", function() {
    // $("#jubi-bottomClick").hide();
    $(".voiceIcon").show();
    $("#voice-buttons").show();
  });
  $("#jubi-bottomClick").click(function() {
    // $("#jubi-bxinput").show();
    // $("#button-send").show();
    // $(".voiceIcon").remove();
  });
  $("#jubi-bottomClick").click(function() {
    $(".voiceIcon").show();
    $("#voice-buttons").show();
    $("#button-send").show();
  });

  let testExp = new RegExp("iPhone|iPad", "i");
  if (testExp.test(navigator.userAgent)) {
    console.log("test");
    $("#button-play-ws").remove();
    $(".jubi-muteUnmuteVoice").hide();
    $("#jubi-bottomClick").show();
    $("#jubi-answerBottom").click(function() {
      $("#voice-buttons").hide();
      $("#jubi-bottomClick").show();
      $("#jubi-bottomClick").attr("style", "display: block !important");
    });
    $("body").on("focusout", "#jubi-answerBottom", function() {
      $("#voice-buttons").hide();
      $("#jubi-bottomClick").show();
    });
    $("#jubi-bottomClick").click(function() {
      $("#jubi-bxinput").show();
      $("#button-send").show();
    });
  } else {
    console.log("msg");
  }
  $("body").on("keydown", "#jubi-answerBottom", function(e) {
    var t = $("#jubi-answerBottom").val(),
      n = document.getElementById("jubi-answerBottom").scrollHeight;
    console.log("textareaheightnow: " + n),
      (document.getElementById("jubi-answerBottom").style.height =
        n < 26 ? "26px" : n + "px"),
      "" == t &&
        (document.getElementById("jubi-answerBottom").style.height = "26px"),
      (document.getElementById("jubi-bxinput").style.height =
        n < 53 ? "53px" : n + "px"),
      "" == t &&
        (document.getElementById("jubi-bxinput").style.height = "53px"),
      (document.getElementById("jubi-textInput").style.height =
        n < 85 ? "85px" : n + "px"),
      "" == t &&
        (document.getElementById("jubi-textInput").style.height = "85px"),
      $("#button-send").show(),
      $("#button-send").css("display", "block !important"),
      $("#button-send").css("display", "block");
  });
});
