(function() {
  this.ecoTemplates || (this.ecoTemplates = {});
  this.ecoTemplates["search-results"] = function(__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
        var item, trade, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;
      
        if (trades.length) {
          __out.push('\n');
          for (_i = 0, _len = trades.length; _i < _len; _i++) {
            trade = trades[_i];
            __out.push('\n  <li class="trade" data-button="Expand" data-trade-id="');
            __out.push(__sanitize(trade.trade_id));
            __out.push('">\n  <div class="account pull-left ');
            __out.push(__sanitize(trade.user_status));
            __out.push('">\n    <img src="');
            __out.push(__sanitize(trade.user_img));
            __out.push('"><a href="');
            __out.push(__sanitize(trade.user_url));
            __out.push('">');
            __out.push(__sanitize(user | html));
            __out.push('</a>\n  </div>\n  <div class="trade-div">\n    <ul class="trans-trade pull-left">\n      ');
            _ref = trade.selling_trade;
            for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
              item = _ref[_j];
              __out.push('\n      <li class="item ');
              __out.push(__sanitize(item.quality));
              __out.push('">\n        <a href="');
              __out.push(__sanitize(item.link));
              __out.push('" title="');
              __out.push(__sanitize(item.name));
              __out.push('"><img class="item-image" src="');
              __out.push(__sanitize(item.img));
              __out.push('"></a>\n      </li>\n      ');
            }
            __out.push('\n    </ul>\n    <div class="trade-arrow"></div>\n    <ul class="trans-trade pull-right">\n      ');
            _ref1 = trade.buying_trade;
            for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
              item = _ref1[_k];
              __out.push('\n      <li class="item ');
              __out.push(__sanitize(item.quality));
              __out.push('">\n        <a href="');
              __out.push(__sanitize(item.link));
              __out.push('" title="');
              __out.push(__sanitize(item.name));
              __out.push('"><img class="item-image" src="');
              __out.push(__sanitize(item.image));
              __out.push('"></a>\n      </li>\n      ');
            }
            __out.push('\n    </ul>\n  </div>\n  <div class="expand"><a>Expand</a></div>\n</li>\n');
          }
          __out.push('\n');
        } else {
          __out.push('\n  No search results\n');
        }
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
