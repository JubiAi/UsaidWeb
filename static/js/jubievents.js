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
    $(".jubi-sec_newFooter button").show();
    // $(".voice-buttons").hide();
  });
  $("body").on("focusout", "#jubi-answerBottom", function() {
    $(".jubi-sec_newFooter button").hide();
    $(".voiceIcon").show();
  });
  $(".voiceIcon").click(function() {
    // $(".voice-buttons").show();
  });
});
