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

function addTrades(query) {
    if (history) history.pushState(null, null, "search?q='" + query +"'");
    $.get('search.json', function(data) {
        foo = JSON.parse(data);
        $('.trades').append(template.expand(JSON.parse(data)));
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
	addTrades($('#search_field').val());
    } else {
        removeTrades();
        addTrades($('#search_field').val());
    }
    return false;
}

$(window).bind("popstate", removeTrades);
$('#search_field').submit(viewTrades);
$('.form-search').submit(viewTrades);
