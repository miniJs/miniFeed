(function() {
  var Time, Tweet, TweetCollection;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __slice = Array.prototype.slice;
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
    Tweet.templateKeys = function() {
      return ['avatar', 'tweet', 'time'];
    };
    function Tweet(data, options) {
      this.data = data;
      this.options = options;
    }
    Tweet.prototype.content = function() {
      var key, template, _i, _len, _ref;
      template = this.options.template;
      _ref = Tweet.templateKeys();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        template = template.replace("{" + key + "}", this[key]());
      }
      return template;
    };
    Tweet.prototype.tweet = function() {
      var tweet;
      tweet = '';
      if (this.options.introText !== null) {
        tweet = "<span class='intro-text'>" + this.options.introText + "</span>";
      }
      tweet += this.originalText();
      if (this.options.outroText !== null) {
        tweet += "<span class='outro-text'>" + this.options.outroText + "</span>";
      }
      return "<span class='" + this.options.tweetClass + "'>" + tweet + "</span>";
    };
    Tweet.prototype.avatar = function() {
      return "<img src='" + (this.avatarUrl()) + "' class='" + this.options.avatarClass + "' title='" + this.options.username + "' height='" + this.options.avatarSize + "' width='" + this.options.avatarSize + "'/>";
    };
    Tweet.prototype.time = function() {
      var time;
      time = new Time(this.data.created_at, this.options.timeFormat);
      return "<span class='" + this.options.timeClass + "'>" + (time.formatted()) + "</span>";
    };
    Tweet.prototype.originalText = function() {
      var originalText;
      originalText = this.data.text;
      originalText = originalText.replace(Tweet.urlRegex(), "<a class=\"mini-feed-link\" href=\"$1\">$1</a>");
      originalText = originalText.replace(Tweet.userRegex(), "<a class=\"mini-feed-user-link\" href=\"http://www.twitter.com/$1\">@$1</a>");
      return originalText.replace(Tweet.hashRegex(), " <a href=\"http://search.twitter.com/search?q=&tag=$1&lang=all\">#$1</a> ");
    };
    Tweet.prototype.listItemClass = function(index, size) {
      if (index === 0) {
        return this.options.firstClass;
      }
      if (index === (size - 1)) {
        return this.options.lastClass;
      }
    };
    Tweet.prototype.avatarUrl = function() {
      return this.data.user.profile_image_url;
    };
    Tweet.prototype.isReply = function() {
      return this.data.in_reply_to_status_id != null;
    };
    Tweet.apiUrl = function(options) {
      var apiUrl;
      apiUrl = "http://api.twitter.com/1/statuses/user_timeline.json?";
      apiUrl += "screen_name=" + options.username;
      apiUrl += "&count=" + options.limit;
      if (!options.hideRetweets) {
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
    TweetCollection.prototype.formattedTweets = function() {
      var $li, $ul, index, tweet, _len, _ref;
      $ul = $('<ul />', {
        'class': this.options.listClass
      });
      _ref = this.tweets;
      for (index = 0, _len = _ref.length; index < _len; index++) {
        tweet = _ref[index];
        if (!(this.options.hideReplies && tweet.isReply())) {
          $li = $('<li />', {
            'class': tweet.listItemClass(index, this.size())
          });
          $li.append(tweet.content());
          $li.appendTo($ul);
        }
      }
      return $ul;
    };
    return TweetCollection;
  })();
  Time = (function() {
    function Time(time, format) {
      this.format = format;
      this.time = time.replace(/^([a-z]{3})( [a-z]{3} \d\d?)(.*)( \d{4})$/i, '$1,$2$4$3');
      this.date = new Date(this.time);
    }
    Time.prototype.formatted = function() {
      if (this.format === "normal") {
        return this.normalFormat();
      }
      return this.relativeFormat();
    };
    Time.prototype.normalFormat = function() {
      return this.date.toDateString();
    };
    Time.prototype.relativeFormat = function() {
      var delta, relative_to;
      relative_to = new Date();
      delta = parseInt((relative_to.getTime() - this.parsedDate()) / 1000);
      if (delta < 60) {
        return 'less than a minute ago';
      } else if (delta < (60 * 60)) {
        return 'about ' + this.pluralize("minute", parseInt(delta / 60)) + ' ago';
      } else if (delta < (24 * 60 * 60)) {
        return 'about ' + this.pluralize("hour", parseInt(delta / 3600)) + ' ago';
      } else {
        return 'about ' + this.pluralize("day", parseInt(delta / 86400)) + ' ago';
      }
    };
    Time.prototype.pluralize = function(word, n) {
      var plural;
      plural = "" + n + " " + word;
      if (n > 1) {
        plural += "s";
      }
      return plural;
    };
    Time.prototype.parsedDate = function() {
      return Date.parse(this.time);
    };
    return Time;
  })();
  $(function() {
    $.miniFeed = function(element, options) {
      var setState, showTweets, state;
      this.defaults = {
        username: 'mattaussaguel',
        limit: 6,
        template: '{avatar}{tweet}{time}',
        introText: null,
        outroText: null,
        listClass: 'tweet-list',
        firstClass: 'first',
        lastClass: 'last',
        avatarSize: '48',
        avatarClass: 'tweet-avatar',
        tweetClass: 'tweet-text',
        hideRetweets: false,
        hideReplies: false,
        timeFormat: 'relative',
        timeClass: 'tweet-time',
        onLoad: function() {},
        onLoaded: function() {}
      };
      state = '';
      this.settings = {};
      this.$element = $(element);
      setState = function(_state) {
        return state = _state;
      };
      showTweets = __bind(function() {
        this.callSettingFunction('onLoad');
        setState('loading');
        return $.getJSON(Tweet.apiUrl(this.settings), __bind(function(data) {
          var tweetCollection;
          setState('formatting');
          tweetCollection = new TweetCollection(data, this.settings);
          this.$element.append(tweetCollection.formattedTweets());
          this.callSettingFunction('onLoaded');
          return setState('loaded');
        }, this));
      }, this);
      this.getState = function() {
        return state;
      };
      this.getSetting = function(settingKey) {
        return this.settings[settingKey];
      };
      this.callSettingFunction = function() {
        var args, functionName;
        functionName = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        return this.settings[functionName](this.$element);
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
