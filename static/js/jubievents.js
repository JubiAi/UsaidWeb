$(document).ready(function(){
    $('body').on('click','#jubi-graySend',function(){
        $('#voice-buttons').css('display','none !important');
        $('#keyboard-icon').css('display','none !important');
        $('#jubi-bxinput').css('display','block !important');
    })

    $('body').on('click','.iconMenu',function(){
        $('#secMenucontent-widget').toggle();
    })
    $('body').on('click','.closeBtn',function(){
        $('#secMenucontent-widget').hide();
    })
    $('body').on('click','.jubi-menu-val',function(){
        $('#secMenucontent-widget').hide();
    })
    $('body').on('click','#jubi-answerBottom',function(){
        $('#secMenucontent-widget').hide();
    })
    $('body').on('click','#pm-data',function(){
        $('#secMenucontent-widget').hide();
    })

    let firstClick = false;
    $('#jubi-secCloseview').click(function(){
        $('#jubiAsideFullopenview').fadeIn(500);
        $('#jubi-secCloseview').hide();
        if (!firstClick) {
            setTimeout(function () {
              if (window.jubiStartEvent) {
                window.jubiStartEvent();
                firstClick = true;
              }
            }, 300);
          }
    })
    $('#closeBotImg').click(function(){
        $('#jubiAsideFullopenview').fadeOut(500);
        $('#jubi-secCloseview').fadeIn(1000);
    })
    $('body').on('input','#jubi-answerBottom',function(){
        let userInput = document.getElementById('jubi-answerBottom').value;
        userInput = userInput.trim();
        if(userInput==""){
            console.log("show send icon")
            $('#button-send').hide()
            $('#button-play-ws').show()
        }
        else if(userInput!=""){
            $('#button-send').show()
            $('#button-play-ws').hide()
            console.log("show voice icon")
        }
        else{
            console.log("show send icon")
            $('#button-send').hide()
            $('#button-play-ws').show()
        }
    })

})