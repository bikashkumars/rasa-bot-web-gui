$(document).ready(function() {

    // Credentials
    var baseUrl = "http://localhost:5005/webhooks/rest/webhook";
    var user = "rasaweb";

    //---------------------------------- Add dynamic html bot content(Widget style) ----------------------------
    // You can also add the html content in html page and still it will work!
    var mybot = '<div class="chatCont" id="chatCont">' +
        '<div class="bot_profile">' +
        '<img src="assets/img/hola.jpeg" class="bot_p_img">' +
        '<div class="close">' +
        '<i class="fa fa-times" aria-hidden="true"></i>' +
        '</div>' +
        '</div><!--bot_profile end-->' +
        '<div id="result_div" class="resultDiv"></div>' +
        '<div class="chatForm" id="chat-div">' +
        '<div class="spinner">' +
        '<div class="bounce1"></div>' +
        '<div class="bounce2"></div>' +
        '<div class="bounce3"></div>' +
        '</div>' +
        '<input type="text" id="chat-input" autocomplete="off" placeholder="Try typing here"' + 'class="form-control bot-txt"/>' +
        '</div>' +
        '</div><!--chatCont end-->' +

        '<div class="profile_div">' +
        '<div class="row">' +
        '<div class="col-hgt">' +
        '<img src="assets/img/hola.jpeg" class="img-circle img-profile">' +
        '</div><!--col-hgt end-->' +
        '<div class="col-hgt">' +
        '<div class="chat-txt">' +
        'Chat with us now!' +
        '</div>' +
        '</div><!--col-hgt end-->' +
        '</div><!--row end-->' +
        '</div><!--profile_div end-->';

    $("mybot").html(mybot);

    // ------------------------------------------ Toggle chatbot -----------------------------------------------
    $('.profile_div').click(function() {
        $('.profile_div').toggle();
        $('.chatCont').toggle();
        $('.bot_profile').toggle();
        $('.chatForm').toggle();
        document.getElementById('chat-input').focus();
    });

    $('.close').click(function() {
        $('.profile_div').toggle();
        $('.chatCont').toggle();
        $('.bot_profile').toggle();
        $('.chatForm').toggle();
    });


    // on input/text enter--------------------------------------------------------------------------------------
    $('#chat-input').on('keyup keypress', function(e) {
        var keyCode = e.keyCode || e.which;
        var text = $("#chat-input").val();
        if (keyCode === 13) {
            if (text == "" || $.trim(text) == '') {
                e.preventDefault();
                return false;
            } else {
                $("#chat-input").blur();
                setUserResponse(text);
                send(text);
                e.preventDefault();
                return false;
            }
        }
    });


    //------------------------------------------- Send request to API.AI ---------------------------------------
    function send(text) {
        var x = {
            "sender": "rasaweb",
            "message": text
        };
        $.ajax({
            url: baseUrl,
            type: 'post',
            data: JSON.stringify(x),
            headers: {
                "Content-Type": 'application/json'
            },
            dataType: 'json',
            success: function(data) {
                main(data);
            }
        });
    }


    //------------------------------------------- Main function ------------------------------------------------
    function main(data) {
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].text) {
                    setBotResponse(data[i].text);
                } else {
                    setBotResponse("<img height='100' width='100' src='" + data[i].image + "' />");
                }

            }
        } else {
            setBotResponse('');
        }
    }


    //------------------------------------ Set bot response in result_div -------------------------------------
    function setBotResponse(val) {
        setTimeout(function() {
            if ($.trim(val) == '') {
                val = 'I couldn\'t get that. Let\' try something else!'
                var BotResponse = '<p class="botResult">' + val + '</p><div class="clearfix"></div>';
                $(BotResponse).appendTo('#result_div');
            } else {
                val = val.replace(new RegExp('\r?\n', 'g'), '<br />');
                var BotResponse = '<p class="botResult">' + val + '</p><div class="clearfix"></div>';
                $(BotResponse).appendTo('#result_div');
            }
            scrollToBottomOfResults();
            hideSpinner();
        }, 500);
    }


    //------------------------------------- Set user response in result_div ------------------------------------
    function setUserResponse(val) {
        var UserResponse = '<p class="userEnteredText">' + val + '</p><div class="clearfix"></div>';
        $(UserResponse).appendTo('#result_div');
        $("#chat-input").val('');
        scrollToBottomOfResults();
        showSpinner();
        $('.suggestion').remove();
    }


    //---------------------------------- Scroll to the bottom of the results div -------------------------------
    function scrollToBottomOfResults() {
        var terminalResultsDiv = document.getElementById('result_div');
        terminalResultsDiv.scrollTop = terminalResultsDiv.scrollHeight;
    }


    //---------------------------------------- Ascii Spinner ---------------------------------------------------
    function showSpinner() {
        $('.spinner').show();
    }

    function hideSpinner() {
        $('.spinner').hide();
    }
});