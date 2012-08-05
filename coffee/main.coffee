$('#search input').typeahead
  source: [
    'Scorch Shot'
    'Flare Gun'
    'Fire Axe'
  ]
$('.top-var-nav li a').tooltip
  placement: 'bottom'

addTrades = (query, push) ->
  history.pushState null, null, "search/" + query  if history.pushState and push
  $.get "/search.json", (data) ->
    $(".trades").append 'eco stuff'
    $(".item a").tooltip placement: "bottom"
    $("#search-results").slideDown 400
  
removeTrades = ->
  $("#search-results").slideUp 400
  $(".trade").remove()

viewTrades = (push) ->
  push = true  if push is `undefined`
  if $(".trade").length is 0
    document.title = $("#search_field").val() + " results on Treddit"
    addTrades $("#search_field").val(), push
  else
    removeTrades()
    document.title = $("#search_field").val() + " results on Treddit"
    addTrades $("#search_field").val(), push
  false

$('.search btn').click viewTrades

viewTrade = (n, push) ->
  history.pushState null, null, "/trade/" + $(".trade:nth-child(" + n + ")").data("trade-id")  if history.pushState and push
  $(".hero-search").css "left", "-101%"
  $("#search-results").slideUp ->
    $(".trade:not(:nth-child(" + n + "))").css "display", "none"
    $(".trade:nth-child(" + n + ") .trade-div").after 'eco stuff'
    $("#search-results").addClass "all-round"
    $("#search-results").css("margin-top", "-" + $(".hero-search").outerHeight() + "px").slideDown()


notifications_sample = notifications: [
  notification_text: "Foo has barred!"
,
  notification_text: "There's a new trade for the Huntsman!"
]
popped = ("state" of window.history)
initialURL = location.href
$(window).bind "popstate", (event) ->
  initialPop = not popped and location.href is initialURL
  popped = true
  return  if initialPop
  urlParts = window.location.pathname.split("/")
  if urlParts.length is 2 and urlParts[0] is "search"
    $("#search_field").val unescape(urlParts[1])
    viewTrades false
  else unless urlParts.length is 2 and urlParts[0] is "trade"
    document.title = "Treddit"
    $("#search_field").val ""
    removeTrades()

$("#search_field").submit viewTrades
$(".form-search").submit viewTrades
$("#notifications").popover
  placement: "bottom"
  title: "Notifications"
  content: ->
    #eco stuff
    'hi'

  trigger: "manual"

$("#notifications").click ->
  $("#notifications").popover "toggle"
  $("#notifications").tooltip "hide"

$(".trades").on "click", ".trade .expand a", (event) ->
  viewTrade $(this).index() + 1, true

setTimeout 5000, ->
  $(".hero-unit").width 0
