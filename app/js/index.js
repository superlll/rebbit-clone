/*!
 * Start Bootstrap - SB Admin 2 v3.3.7+1 (http://startbootstrap.com/template-overviews/sb-admin-2)
 * Copyright 2013-2016 Start Bootstrap
 * Licensed under MIT (https://github.com/BlackrockDigital/startbootstrap/blob/gh-pages/LICENSE)
 */

'use strict';


var currentTopic = null;

var editingMessageKey = null;

// Loads the correct sidebar on window load,
// collapses the sidebar on window resize.
// Sets the min-height of #page-wrapper to window size
/*$(function() {
    // Checks that the Firebase SDK has been correctly setup and configured.
    if (!window.firebase || !(firebase.app instanceof Function) || !window.config) {
        window.alert('You have not configured and imported the Firebase SDK. ' +
            'Make sure you go through the codelab setup instructions.');
    } else if (config.storageBucket === '') {
        window.alert('Your Cloud Storage bucket has not been enabled. Sorry about that. This is ' +
            'actually a Firebase bug that occurs rarely. ' +
            'Please go and re-generate the Firebase initialisation snippet (step 4 of the codelab) ' +
            'and make sure the storageBucket attribute is not empty. ' +
            'You may also need to visit the Storage tab and paste the name of your bucket which is ' +
            'displayed there.');
    }*/

    //$('#side-menu').metisMenu();
    // resize the topic
   /* $(window).bind("load resize", function() {
        var topOffset = 50,
            width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse');
            topOffset = 100; // 2-row-menu
        } else {
            $('div.navbar-collapse').removeClass('collapse');
        }

        var height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");
        }
    });*/

    // enable and disable submit button
    // based on whether there is something in the input box
    $('#input-box').keyup(function() {
        if ($(this).val() == '') {
            $('#submit').prop('disabled', true);
        }
        else {
            $('#submit').prop('disabled', false);
        }
    });

    $('#input-box').keydown(function(e) {
        if (e.keycode == 13) {
            e.preventDefault();
            return false;
        }
    });

    // submit message
    // and restore input and button
    $('#submit').click(function(e) {
        e.preventDefault();
        if (firebase.auth().currentUser == null) {
            $('#snackbar').text('Please log in first');
            $('#snackbar').addClass('show');
            setTimeout(function() {
                $('#snackbar').removeClass('show');
            }, 3000);
            return;
        }
        var curUser = firebase.auth().currentUser,
            curTime = new Date().toLocaleString();
        firebase.database().ref(currentTopic).push({
            username: curUser.displayName,
            profileImg: curUser.photoURL,
            message: $('#input-box').val(),
            timestamp: curTime,
            uid: curUser.uid
        });
        $('#input-box').val('');
        $('#input-holder').removeClass('is-dirty');
        $('#submit').prop('disabled', true);
    });

//});

// toggle topics
$('.topic-botton').click(function() {
    firebase.database().ref(currentTopic + "/").off();
    if (typeof($(this).attr('id')) == 'undefined') {
        console.log("no action here. return.");
        return;
    }
    currentTopic = $(this).attr('id');
    $('#message-box tbody').empty();
    $('#page-header').text($(this).find('a').text());
    if ($(this).attr('id') != "home") {
        //$('#home-content').hide();
        $('#input-message').show();
    }
    else {
        //$('#home-content').show();
        $('#input-message').hide();
    }
    // load messages for topics  
    firebase.database().ref(currentTopic + "/").limitToLast(50).on('child_added', function(data) {
        var key = data.key,
            newMessage = data.val();
        $('#message-box tbody').append(
            '<tr id=\"' + key + '\">' +
            '<td style=\"width: 5%;\"><div style=\"height: 40px; width: 40px; background-size: 40px; border-radius: 40px; background-image: url(&quot;' + newMessage.profileImg + '&quot;);\"></div></td>' +
            '<td style=\"width: 79%;\"><div class=\"name-time\" style=\"font-weight: 500; font-style: italic; font-size: 1.0rem;">' + newMessage.username + '     ' + newMessage.timestamp + '</div>' +
            '<div class=\"msg\">' + newMessage.message + '</div></td>' +
            '</tr>'
        );
    });


    firebase.database().ref(currentTopic + "/").on('child_removed', function(data) {
        var removedKey = data.key;
        $('#' + removedKey).remove();
    });

    firebase.database().ref(currentTopic + "/").on('child_changed', function(data) {
        var changedKey = data.key,
            uname = firebase.auth().currentUser.displayName,
            newTime = data.val().timestamp,
            newMsg = data.val().message;
        $('#' + changedKey).find('.name-time').text(uname + '     ' + newTime);
        $('#' + changedKey).find('.msg').text(newMsg);
    });
});


$('.ttspan-right').on('click', function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("tt-toggled");
});
