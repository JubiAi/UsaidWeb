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
    $("#button-play-ws").hide();
    $("#voice-buttons").hide();
    $("#jubi-bottomClick").show();
    // $("#jubi-bottomClick").attr("style", "display: block !important");
  });
  $("#jubi-bottomClick").click(function() {
    $("#jubi-bottomClick").hide();
    $("#jubi-bxinput").show();
    $("#voice-buttons").show();
    $("#button-send").show();
    setTimeout(function() {
      // $("#jubi-textInput").css({ height: "78px" });
      // $("#jubi-bxinput").css({ height: "53px" });
      $("#jubi-answerBottom").css({ height: "26px" });
    }, 50);
    // $(".voiceIcon").show();
  });
  $("body").on("focusout", "#jubi-answerBottom", function() {
    // $("#jubi-bottomClick").hide();
    $("#button-play-ws").show();
    $("#voice-buttons").show();
  });
  $("body").on("focusin", "#jubi-answerBottom", function() {
    $("#jubi-bottomClick").show();
    $("#button-play-ws").hide();
    $("#voice-buttons").hide();
  });

  $("#pm-data").click(function() {
    $("#jubi-bottomClick").hide();
    // $("#voice-buttons").show();
    // $("#button-send").show();
  });
  $(".inputmenu").click(function() {
    $("#jubi-bottomClick").hide();
    // $("#voice-buttons").show();
    // $("#button-send").show();
  });
  $("#jubi-answerBottom").on("keypress", function(e) {
    if (e.which == 13) {
      $("#jubi-bottomClick").hide();
    }
  });

  let testExp = new RegExp("iPhone|iPad", "i");
  if (testExp.test(navigator.userAgent)) {
    console.log("test");
    // $("#mainTable").css("height:88vh");
    // $("#button-send").show();
    $("#jubi-chat-loader-app .pm-sec_openview").css({ height: "88vh" });
    $("#jubi-answerBottom").css({ margin: "13px 0px 0px 11px" });
    $("#jubi-bottomClick").show();
    $("#button-play-ws").remove();
    $(".jubi-muteUnmuteVoice").hide();
    $("#voice-buttons").hide();

    $("#jubi-answerBottom").click(function() {
      $("#voice-buttons").hide();
      $("#jubi-bottomClick").show();
      $("#jubi-bottomClick").attr("style", "display: block !important");
    });
    $("body").on("focusout", "#jubi-answerBottom", function() {
      $("#voice-buttons").hide();
      $("#jubi-bottomClick").show();
      $("#button-send").show();
    });
    $("#jubi-bottomClick").click(function() {
      // $(".jubi-sec_newFooter button:hover").css({
      //   "background-color": "#00a2fe"
      // });
      $("#jubi-bottomClick").show();
      $("#jubi-bxinput").show();
      $("#button-send").show();
    });
    $("#jubi-answerBottom").on("keypress", function(e) {
      if (e.which == 13) {
        $("#jubi-bottomClick").show();
      }
    });
    $("#pm-data").click(function() {
      $("#jubi-bottomClick").show();
    });
    $(".inputmenu").click(function() {
      $("#jubi-bottomClick").show();
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
      // (document.getElementById("jubi-bxinput").style.height = n < 53 ? "53px" : n + "px"), "" == t &&
      // (document.getElementById("jubi-bxinput").style.height = "53px"),
      // (document.getElementById("jubi-textInput").style.height = n < 93 ? "93px" : n + "px"), "" == t &&
      // (document.getElementById("jubi-textInput").style.height = "93px"),
      $("#button-send").show(),
      $("#button-send").css("display", "block !important"),
      $("#button-send").css("display", "block");
  });
});
