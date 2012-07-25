var template = jsontemplate.Template('{.repeated section trades}<li class="trade">\
  <div class="account pull-left {user_status|html-attr-value}">\
    <img src="{user_img|html-attr-value}"><a href="{user_url|html-attr-value}">{user|html}</a>\
  </div>\
  <div class="trade-div">\
    <ul class="trans-trade pull-left">\
      {.repeated section selling_trade}\
      <li class="item {quality|html-attr-value}">\
        <a href="{link|html-attr-value}" title="{name|html-attr-value}"><img class="item-image" src="{img|html-attr-value}"></a>\
      </li>\
      {.end}\
    </ul>\
    <div class="arrow"></div>\
    <ul class="trans-trade pull-right">\
      {.repeated section buying_trade}\
      <li class="item {quality|html-attr-value}">\
        <a href="{link|html-attr-value}" title="{name|html-attr-value}"><img class="item-image" src="{img|html-attr-value}"></a>\
      </li>\
      {.end}\
    </ul>\
  </div>\
</li>\
{.end}');

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function addTrades(query) {
    if (history) history.pushState({'query': query}, null, "search?q=" + query);
    $.getJSON('search.json', function(data) {
        $('.trades').append(template.expand(data));
        $('.item a').tooltip({placement: 'bottom'});
        $('#search-results').slideDown(400);
          });
}

function removeTrades() {
    /*if (history && pop) history.pushState(null, null, "");*/
    $('#search-results').slideUp(400);
    $('.trade').remove();
}

function viewTrades() {
    if ($('.trade').length == 0) {
        document.title = $('#search_field').val() + ' results on Treddit';
	addTrades($('#search_field').val());
    } else {
        removeTrades();
        document.title = $('#search_field').val() + ' results on Treddit';
        addTrades($('#search_field').val());
    }
    return false;
}
var popped = ('state' in window.history), initialURL = location.href

$(window).bind("popstate", function(event) {
    var initialPop = !popped && location.href == initialURL;
    popped = true;
    if (initialPop) return;
    if (getUrlVars().q) {
        $('#search_field').val(unescape(getUrlVars().q));
        viewTrades();
    } else {
         document.title = 'Treddit';
         $('#search_field').val('');
         removeTrades();
    }});
$('#search_field').submit(viewTrades);
$('.form-search').submit(viewTrades);
