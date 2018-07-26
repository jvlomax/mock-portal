function showModal(selector, bodyText, confirmFunction, declineFunction) {
    var $modal = $(selector);
    if (bodyText !== undefined) {
        $modal.find('.modal-body').html(bodyText);
    }
    $modal.modal('show');
    // Remove previously bound functions to avoid repeated calls if user calls modal repeatedly
    $modal.find('#confirm-no').unbind("click");
    $modal.find('#confirm-yes').unbind("click");
    $modal.unbind('hidden.bs.modal');

    $modal.find('#confirm-no').click(function(event) {
        // unbind hidden event
        $modal.unbind('hidden.bs.modal');
        $modal.modal('hide');
        if (declineFunction !== undefined) {
            declineFunction(event);
        }
    });

    $modal.find('#confirm-yes').click(function(event) {
        // unbind hidden event
        $modal.unbind('hidden.bs.modal');
        $modal.modal('hide');
        if (confirmFunction !== undefined) {
            confirmFunction(event);
        }
    });

    $modal.on('hidden.bs.modal', function(event) {
        // This event is fired when the modal has finished being hidden from the
        // user (will wait for CSS transitions to complete).
        // http://getbootstrap.com/javascript/#modals-events
        if (declineFunction !== undefined) {
            declineFunction(event);
        }
    });
}

function displayProgrammeStatistics(programme_id, programme_name, django_url) {

    $.ajax({
        dataType: "json",
        type: "GET",
        url: "/api/" + programme_id + "/statistics/",
        success: function(data) {

            var programme_statistics = data[programme_name];
            var game_statistics = programme_statistics["games"];
            var programme_stats = "";
            var game_stats = "";

            for(var key in programme_statistics) {
                if(key == "games") {
                    continue;
                }
                programme_stats += "<li>" + key + ' : ' + programme_statistics[key] + "</li>";
            }

            if(typeof(game_statistics) == 'undefined') {
                game_stats = "No individual Game data found";
            } else {
                for(var game in game_statistics) {
                    for(var game_stat in game_statistics[game]) {
                        game_stats += "<li>" + game + ' : ' + game_stat + "</li>";
                    }
                }
            }
            $("#programme_statistics").html(programme_stats);
            $("#game_statistics").html(game_stats);
        },
        statusCode: {
            404: function() {
             console.log("bad");
            }
        }
    });
}

function toggleAutoEmailReport(state, url) {
    $.ajax({
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        url: url,
        type: 'PATCH',
        data: {
            autoemail_report: state
        }
    });
}

function toggleProgrammeActive(state, url, complete) {
    $.ajax({
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        url: url,
        data: {
            active: state
        },
        type: 'PATCH',
        complete: complete
    });
}

/// method used to get csrftoken for unsafe csrf requests (DELETE, PUT, PATCH, etc)
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function toggleStar() {
    /* Apply star/no star to player in front end and effect change in backend. */
    var star = $(this).children(".glyphicon-star");
    star.addClass("glyphicon-refresh loader");
    updateObject({
        url: $(this).attr("data-ajax-target"),
        data: {starred: !star.hasClass("starred")},
        success: function () {
            star.toggleClass("starred");
        },
        error: function () {
            noty({
                text: "Player update failed. Please try again or contact support.",
                type: 'error'
            });
        },
        complete: function () {
            setTimeout(function () {
                star.removeClass("glyphicon-refresh loader");
            }, 200)
        }
    });

    return false;
}

function updateObject(params) {
    /* Update an object with the given params */
    var ajaxParams = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        type: 'PATCH'
    };
    for(var key in params) {
        ajaxParams[key] = params[key];
    }
    $.ajax(ajaxParams);
};

// Nest tabs
$('ul.nav-tabs a').click(function (e) {
    e.preventDefault();
        $(this).tab('show');
});
