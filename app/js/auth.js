$('#sign-in').click(function() {
    // Sign in Firebase using popup auth and Google as the identity provider.
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        $('#home').trigger('click');
    }).catch(function(error) {
        var errorCode = error.code,
            errorMessage = error.message,
            email = error.email,
            credential = error.credential;
    });
});

$('#sign-github').click(function() {
    // Sign in Firebase using popup auth and Google as the identity provider.
    var provider2 = new firebase.auth.GithubAuthProvider();
    firebase.auth().signInWithPopup(provider2).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        $('#home').trigger('click');
    }).catch(function(error) {
        var errorCode = error.code,
            errorMessage = error.message,
            email = error.email,
            credential = error.credential;
    });
});


$('#sign-out').click(function() {
    firebase.auth().signOut().then(function() {
        $('#home').trigger('click');
    }).catch(function(error) {
        console.log(error);
    });
});

// monitor user login state
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        var userName = user.displayName,
            profilePicUrl = user.photoURL;
        // Set the user's profile pic and name.
        $('#user-pic').css("background-image", "url(" + profilePicUrl + ")");
        $('#user-name').text(userName);
        $('#user-name').show();
        $('#user-pic').show();
        $('#sign-out').show();
        $("#sign-in").hide();
    }
    else {
        $("#user-name").hide();
        $("#user-pic").hide();
        $("#sign-out").hide();
        $("#sign-in").show();
    }
});

