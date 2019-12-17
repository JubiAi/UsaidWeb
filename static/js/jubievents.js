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
  });
  $("body").on("focusout", "#jubi-answerBottom", function() {
    $("#jubi-bottomClick").hide();
    $(".voiceIcon").show();
    $("#voice-buttons").show();
  });

  let testExp = new RegExp("iPhone|iPad|", "i");
  if (testExp.test(navigator.userAgent)) {
    console.log("test");
    //code here
    $("#button-play-ws").css("display", "none");
  } else {
    $("#button-play-ws").css("display", "block");
  }
});
