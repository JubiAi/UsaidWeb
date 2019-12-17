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
    $("#jubi-bottomClick").hide();
    $(".voiceIcon").show();
    $("#voice-buttons").show();
  });
  $("#jubi-bottomClick").click(function() {
    // $("#jubi-bxinput").show();
    $("#button-send").show();
    $(".voiceIcon").remove();
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

  textarea = document.querySelector("#jubi-answerBottom");
  textarea.addEventListener("input", autoResize, false);

  function autoResize() {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  }
});
