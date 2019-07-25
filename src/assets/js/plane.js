$(document).on("click", "#send", function(){
      setTimeout(function() {
      }, 800);

    // Send the form
    var users = [];
    $('.invitation-guest').each(function() {
        var name = $($(this).children(".firstname")[0]).val();
        var user = {
            firstName: name,
            lastName: $($(this).children(".lastname")[0]).val(),
            dietaryRestrictions: $($(this).children(".diet-input")[0]).val(),
            rsvp: $("input[name='rsvp-"+name+"']:checked").val(),
            songRequest: $("#song-request").val()
        }
        users.push(user);
    });

    $.ajax({
        method:"POST",
        url:"/sendRsvp",
        data: JSON.stringify(users),
        contentType: "application/json",
        success:function(res) {
            UIkit.notification("RSVP sent!", "primary");
            //Clear the form
            $(".invitees").html("");
            $("#send").hide();
        }
    });
  });

  $(document).on("click", "#lookup-button", function() {
      $("#lookup-button").hide();
      $("#lookup-searching").show();
    var user = {
        firstName: document.getElementById("firstName").value, 
        lastName: document.getElementById("lastName").value
    };
      
    $.post("/lookupUser", user)
        .success(function(res) {
            if (res.party.length == 0) {
                var innerHtml = "<p>Sorry, we're having trouble finding your digital invite. Try entering your name exactly as it appears on your paper invitation.</p>";
                innerHtml += "<p>If you are still having trouble, feel free to <a href='mailto:c.bales@outlook.com'>email us</a> your RSVP directly.";
                $('.invitees').html(innerHtml);
                $('.invitees').slideDown('400');
                $("#lookup-searching").hide();
                $('#lookup-button').show();
            } else {
                var innerHtml = '<div style="border: 1px solid gray; padding: 25px; margin-top: 20px;"><h2 style="color: inherit; font-family: \'Montaga\', serif;">Your Invitation</h2><hr/>';
                if (res.rsvpData.length > 0) {
                    innerHtml += "<p>You have already RSVP'd. Thanks!</p>";
                    innerHtml += "<p>If you need to change your RSVP, please send us an <a href='mailto:c.bales@outlook.com'>email</a>.</p>";
                }

                for (var i = 0; i < res.party.length; i++)
                {
                    guest = res.party[i];
                    innerHtml += '<div class="invitation-guest"><input type="text" hidden class="firstname" value='+guest[0]+'>';
                    innerHtml += '<input type="text" hidden class="lastname" value='+guest[1]+'>';
                    innerHtml += '<h3 class="guestname" style="text-align: left; font-size: 1.2rem;">' + guest[0] + ' ' + guest[1] + '</h3>';
                    innerHtml += ' <label style="margin-right: 20px"><input class="uk-radio" type="radio" name="rsvp-'+guest[0]+'" id="rsvp-yes-'+guest[0]+'" value="yes"> I will be attending</label>  ';
                    innerHtml += '<label><input class="uk-radio" type="radio" name="rsvp-'+guest[0]+'" id="rsvp-no-'+guest[0]+'" value="no"> I will not be attending</label>';
                    innerHtml += '<p class="diet-link" id="diet-link-'+guest[0]+'" style="text-align: left; cursor: pointer">+ Dietary restrictions</p>'
                    innerHtml += '<input class="uk-input diet-input" id="diet-'+guest[0]+'" type="text" style="margin-top: 10px; display: none" placeholder="Dietary restrictions" />';
                    innerHtml += '</div><hr/>';
                }
                innerHtml += '<br/><input class="uk-input" id="song-request" type="text" placeholder="Favorite dance song" /></div>';
                $('.invitees').html(innerHtml);
                $("#lookup-searching").hide();
                $('#lookup-button').show();
                $('.invitees').slideDown('400');
                $("#send").show();

                if (res.rsvpData.length > 0) {
                    var form = document.getElementById("rsvp-form");
                    var elements = form.elements;
                    for (var i = 0, len = elements.length; i < len; ++i) {
                        elements[i].readOnly = true;
                    }
                    document.getElementById("firstName").readOnly = false;
                    document.getElementById("lastName").readOnly = false;
                    $("#rsvp-form input[type=radio]").attr('disabled', true);
                    $("#send").hide();

                    for(var i = 0; i < res.rsvpData.length; i++)
                    {
                        guest = res.rsvpData[i];
                        if (guest[2] == "yes") {
                            $("#rsvp-yes-"+guest[0]).prop("checked", true);
                        } else if (guest[2] == "no") {
                            $("#rsvp-no-"+guest[0]).prop("checked", true);
                        }
                    }
                    if (res.rsvpData[0][4]) {
                        $("#song-request").val(res.rsvpData[0][4]);
                    }
                }
            }
        }).error(function(err){
            var innerHtml = "<p>Something went wrong!</p>";
            innerHtml += "<p>It's not you, it's us. Please send us an <a href='mailto:c.bales@outlook.com'>email</a> and we'll work on getting it fixed for you.";
            $('.invitees').html(innerHtml);
            $('.invitees').slideDown('400');
            $("#lookup-searching").hide();
            $('#lookup-button').show();
        });
    $.post("/lookupRehearsalInvitation", user)
        .success(function(res) {
            var rehearsalHtml = '<div style="border: 1px solid gray; padding: 25px; margin-top: 20px;"><h2 style="color: inherit; font-family: \'Montaga\', serif;">Rehearsal Dinner</h2><hr/>';
            console.log(res.party);
            if (res.party.length > 0) {
                console.log('found a party');
                if (res.party[0].length > 3) {
                    console.log(res.party[0].length);
                    rehearsalHtml += "<p>You have already RSVP'd. Thanks!</p>";
                    rehearsalHtml += "<p>If you need to change your RSVP, please send us an <a href='mailto:c.bales@outlook.com'>email</a>.</p>";
                }
                else {
                    for (var i = 0; i < res.party.length; i++)
                    {
                        guest = res.party[i];
                        rehearsalHtml += '<div class="invitation-guest"><input type="text" hidden class="firstname" value='+guest[0]+'>';
                        rehearsalHtml += '<input type="text" hidden class="lastname" value='+guest[1]+'>';
                        rehearsalHtml += '<h3 class="guestname" style="text-align: left; font-size: 1.2rem;">' + guest[0] + ' ' + guest[1] + '</h3>';
                        rehearsalHtml += ' <label style="margin-right: 20px"><input class="uk-radio" type="radio" name="rsvp-'+guest[0]+'" id="rsvp-yes-'+guest[0]+'" value="yes"> I will be attending</label>  ';
                        rehearsalHtml += '<label><input class="uk-radio" type="radio" name="rsvp-'+guest[0]+'" id="rsvp-no-'+guest[0]+'" value="no"> I will not be attending</label>';
                        rehearsalHtml += '<p class="meal-label" id="meal-label-'+guest[0]+'" style="text-align: left;">Meal selection</p>'
                        rehearsalHtml += ' <label style="margin-right: 20px"><input class="uk-radio" type="radio" name="meal-'+guest[0]+'" id="meal-chicken-'+guest[0]+'" value="chicken"> Chicken</label>  ';
                        rehearsalHtml += '<label style="margin-right: 20px"><input class="uk-radio" type="radio" name="meal-'+guest[0]+'" id="meal-beef-'+guest[0]+'" value="beef"> Beef</label>';
                        rehearsalHtml += '<label><input class="uk-radio" type="radio" name="meal-'+guest[0]+'" id="meal-pasta-'+guest[0]+'" value="pasta"> Pasta (v)</label>';
                        rehearsalHtml += '</div><hr/>';
                    }
                }
                $('.rehearsal').html(rehearsalHtml);
                $('.rehearsal').slideDown('400');
                $("#send").show();
            }
        }).error(function(err){
            var innerHtml = "<p>Something went wrong when looking up your Rehearsal Dinner Invitation!</p>";
            innerHtml += "<p>It's not you, it's us. Please send us an <a href='mailto:c.bales@outlook.com'>email</a> and we'll work on getting it fixed for you.";
            $('.rehearsal').html(innerHtml);
            $('.rehearsal').slideDown('400');
            $("#lookup-searching").hide();
            $('#lookup-button').show();
        });


  });

  $(document).ready(function() {
      setTimeout(function() {
        $("#send").hide();
      }, 2000);
    
  });

  $(document).on("click", ".diet-link", function() {
    var linkName = this.id;
    var name = linkName.substring(10);
    var fieldName = "#diet-" + name;

    $(fieldName).show();
    $("#"+linkName).hide();
  });

  $(document).on("click", "#national-page .uk-button-default", function(){
      getStateInfo($(this).html());
  });


function getStateInfo(state){
    $("#national-page").hide();
    $("#state-page").show();
    $.get("/getState", state)
    .success(function(res) {
        var innerHtml = '<h3 class="uk-heading-divider uk-text-muted">National Parks in ' + state + '</h3>';
        innerHtml += '<ul>';
        for (var i = 0; i < res.length; i++) {
        park = res[i];
            innerHtml += '<div class="uk-button uk-button-default" onclick="showNameBox('+park[0]+')" style="margin-bottom: 10px">' + park[1] + '</div>';
        }
        innerHtml += '</ul>';
        $("#state-page").html(innerHtml);
    });
}

function showNameBox(id) {
    $("#state-page").hide();
    $("#name-page").show();
    $('.uk-modal-title').html('Add a Pin');
    $("#park-number").val(id);
}

$(document).on("click", "#submit-pin", function(){
    setTimeout(function() {
        var pin = {
            name: document.getElementById('guest-name').value,
            parkId: document.getElementById('park-number').value
        }

        $.post('/createPin', pin)
        .success(function(res) {
            $("#name-page").hide();
            $("#success-page").show();
        })
    }, 800);
});

$(document).on("click", "#add-another", function() {
    resetMapModal();
});
$(document).on("click", "#close-modal", function() {
    resetMapModal();
});


function resetMapModal() {
    $('.uk-modal-title').html('National Parks by State');
    $("#state-page").hide();
    $("#name-page").hide();
    $("#success-page").hide();
    $("#national-page").show();
}

$(document).on("click", "#bug-submit-btn", function() {
    sendBug();
});
function sendBug() {
    issue = $("#issue-content").val();
    notify = document.getElementById('notify-me').checked;
    name = $("#name").val();
    var details = {
        issue: issue,
        notify: notify,
        name: name
    }
    $.post('/sendBug', details).success(function(res) {
        UIkit.modal("#bug-modal").hide();
        UIkit.notification("Bug logged!", "primary");
    })
}

  function showComingSoon(data) {
    $(data).children("img").hide();
    $(data).append('<p style="font-size: 2rem">Coming soon</p>');
  }

  function hideComingSoon(data) {
      $(data).children("img").show();
      $(data).children("p").remove();
  }