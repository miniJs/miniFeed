(function() {
  var Tweet, TweetCollection;
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
    Tweet.prototype.avatar_url = function() {
      return this.tweet.user.profile_image_url;
    };
    Tweet.prototype.formatText = function() {
      var tweet;
      tweet = this.tweet.text;
      tweet = tweet.replace(Tweet.urlRegex(), "<a class=\"mini-feed-link\" href=\"$1\">$1</a>");
      tweet = tweet.replace(Tweet.userRegex(), "<a class=\"mini-feed-user-link\" href=\"http://www.twitter.com/$1\"><span>@</span>$1</a>");
      return tweet.replace(Tweet.hashRegex(), "<a href=\"http://search.twitter.com/search?q=&tag=$1&lang=all\">#$1</a>");
    };
    Tweet.prototype.format = function() {
      var tweet;
      tweet = '';
      if (this.options.introText !== null) {
        tweet += "<span class='intro-text'>" + this.options.introText + "</span>";
      }
      tweet += this.formatText();
      if (this.options.outroText !== null) {
        tweet += "<span class='outro-text'>" + this.options.outroText + "</span>";
      }
      return tweet;
    };
    Tweet.prototype.cssClass = function(index, size) {
      if (index === 0) {
        return this.options.firstClass;
      }
      if (index === (size - 1)) {
        return this.options.lastClass;
      }
    };
    Tweet.apiUrl = function(options) {
      var apiUrl;
      apiUrl = "http://api.twitter.com/1/statuses/user_timeline.json?";
      apiUrl += "screen_name=" + options.username;
      apiUrl += "&count=" + options.limit;
      if (options.showRetweets) {
        apiUrl += "&include_rts=1";
      }
      apiUrl += "&callback=?";
      return apiUrl;
    };
    return Tweet;
  })();
  TweetCollection = (function() {
    function TweetCollection(apiData, options) {
      var tweet, _i, _len;
      this.options = options;
      this.tweets = [];
      for (_i = 0, _len = apiData.length; _i < _len; _i++) {
        tweet = apiData[_i];
        this.tweets.push(new Tweet(tweet, this.options));
      }
    }
    TweetCollection.prototype.size = function() {
      return this.tweets.length;
    };
    TweetCollection.prototype.firstTweet = function() {
      return this.tweets[0];
    };
    TweetCollection.prototype.avatar = function() {
      var avatarImage;
      avatarImage = null;
      if (this.size !== 0) {
        avatarImage = $('<img />', {
          'src': this.firstTweet().avatar_url(),
          'title': this.options.username,
          'height': this.options.avatarSize,
          'width': this.options.avatarSize
        });
      }
      return avatarImage;
    };
    TweetCollection.prototype.list = function() {
      var $ul, index, tweet, _len, _ref;
      $ul = $("<ul />", {
        "class": this.options.className
      });
      _ref = this.tweets;
      for (index = 0, _len = _ref.length; index < _len; index++) {
        tweet = _ref[index];
        $("<li />", {
          "html": tweet.format(),
          "class": tweet.cssClass(index, this.size)
        }).appendTo($ul);
      }
      return $ul;
    };
    TweetCollection.prototype.formattedTweets = function() {
      var $wrapper;
      $wrapper = $("<div />", {
        "class": this.options.className
      });
      if (this.options.showAvatar) {
        $wrapper.append(this.avatar());
      }
      $wrapper.append(this.list());
      return $wrapper;
    };
    return TweetCollection;
  })();
  $(function() {
    $.miniFeed = function(element, options) {
      var setState, showAnimateProperties, showTweets, state;
      this.defaults = {
        username: 'mattaussaguel',
        limit: 4,
        template: '{avatar}{tweet}{date}{time}',
        introText: null,
        outroText: null,
        className: 'tweet-list',
        firstClass: 'first',
        lastClass: 'last',
        showAvatar: false,
        avatarSize: '48',
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
      showAnimateProperties = {
        opacity: 1
      };
      this.settings = {};
      this.$element = $(element);
      setState = function(_state) {
        return state = _state;
      };
      showTweets = __bind(function() {
        setState('loading');
        return $.getJSON(Tweet.apiUrl(this.settings), __bind(function(data) {
          var tweetCollection;
          setState('formatting');
          tweetCollection = new TweetCollection(data, this.settings);
          $(element).append(tweetCollection.formattedTweets());
          return setState('loaded');
        }, this));
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
