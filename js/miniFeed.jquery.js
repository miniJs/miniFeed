(function() {
  var Tweet;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Tweet = (function() {
    Tweet.urlRegex = function() {
      return /((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi;
    };
    Tweet.userRegex = function() {
      return /[\@]+([A-Za-z0-9-_]+)/gi;
    };
    Tweet.hashRegex = function() {
      return /\s[\#]+([A-Za-z0-9-_]+)/gi;
    };
    function Tweet(tweet, options) {
      this.tweet = tweet;
      this.options = options;
    }
    Tweet.prototype.formatText = function() {
      var tweet;
      tweet = this.tweet.text;
      tweet = tweet.replace(Tweet.urlRegex(), "<a class=\"mini-feed-link\" href=\"$1\">$1</a>");
      tweet = tweet.replace(Tweet.userRegex(), "<a class=\"mini-feed-user-link\" href=\"http://www.twitter.com/$1\"><span>@</span>$1</a>");
      return tweet.replace(Tweet.hashRegex(), "<a href=\"http://search.twitter.com/search?q=&tag=$1&lang=all\">#$1</a>");
    };
    Tweet.prototype.format = function() {
      var tweet;
      tweet = "";
      if (this.options.introText !== null) {
        tweet += this.options.introText;
      }
      tweet += this.formatText();
      if (this.options.outroText !== null) {
        return tweet += this.options.outroText;
      }
    };
    Tweet.prototype.cssClass = function(index, size) {
      if (index === 0) {
        return this.options.firstClass;
      }
      if (index === (size - 1)) {
        return this.options.lastClass;
      }
    };
    Tweet.apiUrl = function(username, limit, showRetweets) {
      var apiUrl;
      apiUrl = "http://api.twitter.com/1/statuses/user_timeline.json?";
      apiUrl += "screen_name=" + username;
      apiUrl += "&count=" + limit;
      if (showRetweets) {
        apiUrl += "&include_rts=1";
      }
      apiUrl += "&callback=?";
      return apiUrl;
    };
    Tweet.formattedTweets = function(tweets) {
      var $ul, index, size, tweet, _len;
      $ul = $("<ul />");
      size = tweets.length;
      for (index = 0, _len = tweets.length; index < _len; index++) {
        tweet = tweets[index];
        $("<li />", {
          "html": tweet.format(),
          "class": tweet.cssClass(index, size)
        }).appendTo($ul);
      }
      return $ul;
    };
    return Tweet;
  })();
  $(function() {
    $.miniFeed = function(element, options) {
      var setState, showAnimateProperties, showTweets, state, tweetFactory, tweets;
      this.defaults = {
        username: 'mattaussaguel',
        limit: 6,
        template: '{avatar}{tweet}{date}{time}',
        introText: null,
        outroText: null,
        className: 'mini-feed',
        firstClass: 'first',
        lastClass: 'last',
        avatarSize: '48px',
        showRetweets: true,
        showTime: true,
        timeFormat: 'normal',
        timeClass: null,
        dateClass: null,
        onLoad: function() {},
        onVisible: function() {},
        showAnimateProperties: {}
      };
      state = '';
      tweets = [];
      showAnimateProperties = {
        opacity: 1
      };
      this.settings = {};
      this.$element = $(element);
      setState = function(_state) {
        return state = _state;
      };
      tweetFactory = __bind(function(data) {
        var tweet, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          tweet = data[_i];
          _results.push(tweets.push(new Tweet(tweet, this.settings)));
        }
        return _results;
      }, this);
      showTweets = __bind(function() {
        setState('loading');
        return $.getJSON(Tweet.apiUrl(this.getSetting('username'), this.getSetting('limit'), this.getSetting('showRetweets')), function(data) {
          setState('formatting');
          tweetFactory(data);
          $(element).append(Tweet.formattedTweets(tweets));
          return setState('loaded');
        });
      }, this);
      this.getState = function() {
        return state;
      };
      this.getTweets = function() {
        return tweets;
      };
      this.getSetting = function(settingKey) {
        return this.settings[settingKey];
      };
      this.callSettingFunction = function(functionName) {
        return this.settings[functionName]();
      };
      this.init = function() {
        this.settings = $.extend({}, this.defaults, options);
        setState('initialising');
        return showTweets();
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
