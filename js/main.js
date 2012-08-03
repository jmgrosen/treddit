var notifications_sample = {'notifications': [{'notification_text': 'Foo has barred!'}, {'notification_text': "There's a new trade for the Huntsman!"}]};

function addTrades(query, push) {
    if (history.pushState && push) history.pushState(null, null, "search/" + query);
    $.get('/search.json', function(data) {
        $('.trades').append(template.expand(data));
        $('.item a').tooltip({placement: 'bottom'});
        $('#search-results').slideDown(400);
          });
    console.log($('.trade .expand a'));
}

function removeTrades() {
    /*if (history && pop) history.pushState(null, null, "");*/
    $('#search-results').slideUp(400);
    $('.trade').remove();
}

function viewTrades(push) {
    if (push === undefined) push = true;
    if ($('.trade').length == 0) {
        document.title = $('#search_field').val() + ' results on Treddit';
        addTrades($('#search_field').val(), push);
    } else {
        removeTrades();
        document.title = $('#search_field').val() + ' results on Treddit';
        addTrades($('#search_field').val(), push);
    }
    return false;
}
var popped = ('state' in window.history), initialURL = location.href

$(window).bind("popstate", function(event) {
    var initialPop = !popped && location.href == initialURL;
    popped = true;
    if (initialPop) return;
    var urlParts = window.location.pathname.split('/');
    if (urlParts.length == 2 && urlParts[0] == 'search') {
        $('#search_field').val(unescape(urlParts[1]));
        viewTrades(false);
    } else if (urlParts.length == 2 && urlParts[0] == 'trade') {
        $(
    } else {
        document.title = 'Treddit';
        $('#search_field').val('');
        removeTrades();
    }});

$('#search_field').submit(viewTrades);
$('.form-search').submit(viewTrades);
$('#notifications').popover({placement: 'bottom', title: 'Notifications', content: function() { return notifications.expand(notifications_sample) }, trigger: 'manual'});
$('#notifications').click(function() {$('#notifications').popover('toggle'); $('#notifications').tooltip('hide');});

function viewTrade(n, push) {
    if (history.pushState && push) history.pushState(null, null, "/trade/" + $('.trade:nth-child(' + n + ')').data('trade-id'));
    $('.hero-search').css('left', '-101%');
    $('#search-results').slideUp(function() {
        $('.trade:not(:nth-child(' + n + '))').css('display', 'none');
        $('.trade:nth-child(' + n + ') .trade-div').after(template_expanded.expand({'description': 'Hello World', 'comments': [{'user_status': 'online', 'user_img': '', 'user_url': '', 'user': 'Foobar', 'comment': 'i like cheese'}, {'user_status': 'online', 'user_img': '', 'user_url': '', 'user': 'Foobar', 'comment': 'i like cheese'}]}));
        $('#search-results').addClass('all-round');
        $('#search-results').css('margin-top', '-' + $('.hero-search').outerHeight() + 'px').slideDown();
    });
}

$('.trades').on('click', '.trade .expand a', function(event) { viewTrade($(this).index() + 1, true) });

setTimeout(5000, function() { $('.hero-unit').width(0) });


