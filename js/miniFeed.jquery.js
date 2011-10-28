(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  $(function() {
    $.miniFeed = function(element, options) {
      var make_url, setState, showAnimateProperties, state;
      this.defaults = {
        username: 'mattaussaguel',
        list: null,
        limit: 6,
        template: '{avatar}{tweet}{date}{time}',
        introText: null,
        outroText: null,
        className: 'mini-feed',
        firstClass: 'first',
        lastClass: 'last',
        avatarSize: '48px',
        showRetweets: true,
        showOnlyFavorites: true,
        timeFormat: 'normal',
        timeClass: null,
        dateClass: null,
        onLoad: function() {},
        onVisible: function() {},
        showAnimateProperties: {}
      };
      state = '';
      showAnimateProperties = {
        opacity: 1
      };
      this.settings = {};
      this.$element = $(element);
      setState = function(_state) {
        return state = _state;
      };
      make_url = __bind(function() {
        var url;
        url = "http://api.twitter.com/";
        if (this.getSetting('list') != null) {
          url += "1/" + (this.getSetting('username')) + "/lists/" + (this.getSetting('list')) + "/statuses.json?";
        } else if (this.getSetting('showOnlyFavorites') != null) {
          url += "favorites/" + (this.getSetting('username')) + ".json?";
        } else {
          url = "http://api.twitter.com/1/statuses/user_timeline.json?";
          url += "screen_name=" + (this.getSetting('username'));
        }
        url += "&count=" + (this.getSetting('limit'));
        if (this.getSetting('showRetweets')) {
          url += "&include_rts=1";
        }
        return url += "&callback=?";
      }, this);
      this.getState = function() {
        return state;
      };
      this.getSetting = function(settingKey) {
        return this.settings[settingKey];
      };
      this.callSettingFunction = function(functionName) {
        return this.settings[functionName]();
      };
      this.init = function() {
        this.settings = $.extend({}, this.defaults, options);
        return $.getJSON(make_url(), function(data) {
          return console.log(data);
        });
      };
      return this.init();
    };
    return $.fn.miniFeed = function(options) {
      return this.each(function() {
        var plugin;
        if ($(this).data('miniFeed') === void 0) {
          plugin = new $.miniFeed(this, options);
          return $(this).data('miniFeed', plugin);
        }
      });
    };
  });
}).call(this);
