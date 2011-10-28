(function() {
  $(function() {
    $.miniFeed = function(element, options) {
      var setState, showAnimateProperties, state;
      this.defaults = {
        username: 'matthieu_tweets',
        list: null,
        limit: 6,
        template: '{avatar}{tweet}{date}{time}',
        introText: null,
        outroText: null,
        className: 'mini-feed',
        firstClass: 'first',
        lastClass: 'last',
        avatarSize: '48px',
        showFavorites: true,
        showReplies: true,
        showRetweets: true,
        showOnlyFavorites: true,
        showOnlyReplies: true,
        showOnlyRetweets: true,
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
        return this.settings = $.extend({}, this.defaults, options);
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
