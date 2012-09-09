
describe('miniFeed', function() {
  var basicTwitterApiResponse, mockResponseWithOptions, twitterApiUrlPrefix;
  twitterApiUrlPrefix = "https://api.twitter.com/1/statuses/user_timeline.json?";
  basicTwitterApiResponse = [
    {
      created_at: "Sun Jul 01 00:00:00 +0000 2012",
      text: "some text",
      in_reply_to_status_id: null,
      user: {
        profile_image_url_https: "image.png"
      }
    }, {
      created_at: "Sun Jul 01 00:00:00 +0000 2012",
      text: "some text",
      in_reply_to_status_id: 1,
      user: {
        profile_image_url_https: "image.png"
      }
    }, {
      created_at: "Sun Jul 01 00:00:00 +0000 2012",
      text: "some text",
      in_reply_to_status_id: null,
      user: {
        profile_image_url_https: "image.png"
      }
    }, {
      created_at: "Sun Jul 01 00:00:00 +0000 2012",
      text: "some text",
      in_reply_to_status_id: null,
      user: {
        profile_image_url_https: "image.png"
      }
    }, {
      created_at: "Sun Jul 01 00:00:00 +0000 2012",
      text: "some text",
      in_reply_to_status_id: null,
      user: {
        profile_image_url_https: "image.png"
      }
    }, {
      created_at: "Sun Jul 01 00:00:00 +0000 2012",
      text: "some text @jquery some text http://jquery.com some text #jquery",
      in_reply_to_status_id: null,
      user: {
        profile_image_url_https: "image.png"
      }
    }
  ];
  mockResponseWithOptions = function($element, options) {
    var plugin;
    this.$element = $element;
    if (options == null) {
      options = {};
    }
    plugin = new $.miniFeed(this.$element, options);
    $.getJSON.mostRecentCall.args[1](basicTwitterApiResponse);
    return plugin;
  };
  beforeEach(function() {
    setFixtures('<div id="feed"></div>');
    this.$element = $('#feed');
    return spyOn($, 'getJSON');
  });
  describe('plugin behavior', function() {
    it('should be available on the jQuery object', function() {
      return expect($.fn.miniFeed).toBeDefined();
    });
    it('should be chainable', function() {
      return expect(this.$element.miniFeed()).toBe(this.$element);
    });
    it('should offer default values', function() {
      var plugin;
      plugin = new $.miniFeed(this.$element);
      return expect(plugin.defaults).toBeDefined();
    });
    return it('should overwrites the settings', function() {
      var options, plugin;
      options = {
        username: 'test',
        limit: 4
      };
      plugin = new $.miniFeed(this.$element, options);
      expect(plugin.settings.username).toBe(options.username);
      return expect(plugin.settings.limit).toBe(options.limit);
    });
  });
  describe('api url construction', function() {
    describe('username option', function() {
      it('should fetch the last tweets for mattaussaguel by default', function() {
        var url;
        new $.miniFeed(this.$element);
        url = "" + twitterApiUrlPrefix + "screen_name=mattaussaguel&count=6&include_rts=true&callback=?";
        return expect($.getJSON).toHaveBeenCalledWith(url, jasmine.any(Function));
      });
      return it('should fetch the last tweets for a custom user if specified', function() {
        var url;
        new $.miniFeed(this.$element, {
          username: 'foo'
        });
        url = "" + twitterApiUrlPrefix + "screen_name=foo&count=6&include_rts=true&callback=?";
        return expect($.getJSON).toHaveBeenCalledWith(url, jasmine.any(Function));
      });
    });
    describe('limit option', function() {
      it('should fetch the last 6 tweets by default', function() {
        var url;
        new $.miniFeed(this.$element);
        url = "" + twitterApiUrlPrefix + "screen_name=mattaussaguel&count=6&include_rts=true&callback=?";
        return expect($.getJSON).toHaveBeenCalledWith(url, jasmine.any(Function));
      });
      return it('should fetch the last n tweets when specified', function() {
        var url;
        new $.miniFeed(this.$element, {
          limit: 10
        });
        url = "" + twitterApiUrlPrefix + "screen_name=mattaussaguel&count=10&include_rts=true&callback=?";
        return expect($.getJSON).toHaveBeenCalledWith(url, jasmine.any(Function));
      });
    });
    return describe('hide retweets', function() {
      it('should include retweets by default', function() {
        var url;
        new $.miniFeed(this.$element);
        url = "" + twitterApiUrlPrefix + "screen_name=mattaussaguel&count=6&include_rts=true&callback=?";
        return expect($.getJSON).toHaveBeenCalledWith(url, jasmine.any(Function));
      });
      return it('should not include retweets if hideRetweets is true', function() {
        var url;
        new $.miniFeed(this.$element, {
          hideRetweets: true
        });
        url = "" + twitterApiUrlPrefix + "screen_name=mattaussaguel&count=6&callback=?";
        return expect($.getJSON).toHaveBeenCalledWith(url, jasmine.any(Function));
      });
    });
  });
  describe('tweet format', function() {
    describe('introText', function() {
      it('should not add any intro text by default', function() {
        mockResponseWithOptions(this.$element);
        return expect(this.$element.find('.tweet-text').first().text()).toBe('some text');
      });
      return describe('with intro text', function() {
        beforeEach(function() {
          return mockResponseWithOptions(this.$element, {
            introText: 'intro text - '
          });
        });
        it('should prepend text with intro text', function() {
          return expect(this.$element.find('.tweet-text').first().text()).toBe('intro text - some text');
        });
        it('should wrap the intro text in a span with intro-text css class', function() {
          return expect(this.$element.find('span.intro-text').first().text()).toBe('intro text - ');
        });
        return it('should add the intro to every tweet', function() {
          return expect(this.$element.find('.tweet-text > span.intro-text').length).toBe(6);
        });
      });
    });
    describe('outroText', function() {
      it('should not add any outro text by default', function() {
        mockResponseWithOptions(this.$element);
        return expect(this.$element.find('.tweet-text').first().text()).toBe('some text');
      });
      return describe('with outro text', function() {
        beforeEach(function() {
          return mockResponseWithOptions(this.$element, {
            outroText: ' - outro text'
          });
        });
        it('should prepend text with outro text', function() {
          return expect(this.$element.find('.tweet-text').first().text()).toBe('some text - outro text');
        });
        it('should wrap the outro text in a span with outro-text css class', function() {
          return expect(this.$element.find('span.outro-text').first().text()).toBe(' - outro text');
        });
        return it('should add the outro to every tweet', function() {
          return expect(this.$element.find('.tweet-text > span.outro-text').length).toBe(6);
        });
      });
    });
    describe('template', function() {
      it('should render every tweet using the default template', function() {
        var $tweet;
        mockResponseWithOptions(this.$element);
        $tweet = this.$element.find('ul > li').first();
        expect($tweet.children().length).toBe(3);
        expect($tweet.children()[0]).toHaveClass('tweet-avatar');
        expect($tweet.children()[1]).toHaveClass('tweet-text');
        return expect($tweet.children()[2]).toHaveClass('tweet-time');
      });
      it('should be able to render template in a different order', function() {
        var $tweet;
        mockResponseWithOptions(this.$element, {
          template: '{time}{avatar}{tweet}'
        });
        $tweet = this.$element.find('ul > li').first();
        expect($tweet.children().length).toBe(3);
        expect($tweet.children()[0]).toHaveClass('tweet-time');
        expect($tweet.children()[1]).toHaveClass('tweet-avatar');
        return expect($tweet.children()[2]).toHaveClass('tweet-text');
      });
      it('should be able to render only 2 elements', function() {
        var $tweet;
        mockResponseWithOptions(this.$element, {
          template: '{tweet}{avatar}'
        });
        $tweet = this.$element.find('ul > li').first();
        expect($tweet.children().length).toBe(2);
        expect($tweet.children()[0]).toHaveClass('tweet-text');
        return expect($tweet.children()[1]).toHaveClass('tweet-avatar');
      });
      it('should be able to render only 1 element', function() {
        var $tweet;
        mockResponseWithOptions(this.$element, {
          template: '{tweet}'
        });
        $tweet = this.$element.find('ul > li').first();
        expect($tweet.children().length).toBe(1);
        return expect($tweet.children()[0]).toHaveClass('tweet-text');
      });
      return it('should be able to render without elements', function() {
        var $tweet;
        mockResponseWithOptions(this.$element, {
          template: ''
        });
        $tweet = this.$element.find('ul > li').first();
        return expect($tweet.children().length).toBe(0);
      });
    });
    describe('links', function() {
      beforeEach(function() {
        mockResponseWithOptions(this.$element);
        return this.$tweet = this.$element.find('li:last > .tweet-text').first();
      });
      it('should link usernames to twitter profile page', function() {
        var $link;
        $link = this.$tweet.find('a.mini-feed-user-link');
        expect($link).toExist();
        expect($link.text()).toBe('@jquery');
        return expect($link.attr('href')).toBe('http://www.twitter.com/jquery');
      });
      it('should link links', function() {
        var $link;
        $link = this.$tweet.find('a.mini-feed-link');
        expect($link).toExist();
        expect($link.text()).toBe('http://jquery.com');
        return expect($link.attr('href')).toBe('http://jquery.com');
      });
      return it('should link hashtags', function() {
        return expect(this.$tweet.html()).toContain('<a href="http://search.twitter.com/search?q=&amp;tag=jquery&amp;lang=all">#jquery</a>');
      });
    });
    return describe('timeFormat', function() {
      it('should display the time in a relative format by default', function() {
        mockResponseWithOptions(this.$element);
        return expect(this.$element.find('.tweet-time').first().text()).toMatch(/ago$/);
      });
      return it('should display the time in a classic format when specified', function() {
        mockResponseWithOptions(this.$element, {
          timeFormat: 'normal'
        });
        return expect(this.$element.find('.tweet-time').first().text()).not.toMatch(/ago$/);
      });
    });
  });
  describe('generated markup', function() {
    describe('listClass', function() {
      it('should generate a list item  with css class tweet-list by default', function() {
        mockResponseWithOptions(this.$element);
        return expect(this.$element.children('ul.tweet-list').first()).toExist();
      });
      return it('should generate list item with custom css class', function() {
        mockResponseWithOptions(this.$element, {
          listClass: 'custom-class'
        });
        expect(this.$element.children('ul').first()).toHaveClass('custom-class');
        return expect(this.$element.children('ul')).not.toHaveClass('tweet-list');
      });
    });
    describe('firstClass', function() {
      it('should add "first" css class on the first tweet', function() {
        mockResponseWithOptions(this.$element, {
          listClass: 'custom-class'
        });
        return expect(this.$element.find('li').first()).toHaveClass('first');
      });
      return it('should add custom css class on the first tweet when specified', function() {
        mockResponseWithOptions(this.$element, {
          firstClass: 'custom-class'
        });
        expect(this.$element.find('li').first()).toHaveClass('custom-class');
        return expect(this.$element.find('li').first()).not.toHaveClass('first');
      });
    });
    describe('lastClass', function() {
      it('should add "last" css class on the last tweet', function() {
        mockResponseWithOptions(this.$element);
        return expect(this.$element.find('li').last()).toHaveClass('last');
      });
      return it('should add custom css class on the last tweet when specified', function() {
        mockResponseWithOptions(this.$element, {
          lastClass: 'custom-class'
        });
        expect(this.$element.find('li').last()).toHaveClass('custom-class');
        return expect(this.$element.find('li').last()).not.toHaveClass('last');
      });
    });
    describe('tweetClass', function() {
      it('should add "tweet-text" css class on the text wrapper by default', function() {
        mockResponseWithOptions(this.$element);
        return expect(this.$element.find('ul > li > span.tweet-text').length).toBe(6);
      });
      return it('should add a custom css class on the text wrapper when specified', function() {
        mockResponseWithOptions(this.$element, {
          tweetClass: 'custom-class'
        });
        expect(this.$element.find('ul > li > span.tweet-text').length).toBe(0);
        return expect(this.$element.find('ul > li > span.custom-class').length).toBe(6);
      });
    });
    describe('avatarSize', function() {
      it('should add set the avatar width and height to 48px by default', function() {
        mockResponseWithOptions(this.$element);
        expect(this.$element.find('img[width="48"]').length).toBe(6);
        return expect(this.$element.find('img[height="48"]').length).toBe(6);
      });
      return it('should add set a custom avatar width and height when specified', function() {
        mockResponseWithOptions(this.$element, {
          avatarSize: 24
        });
        expect(this.$element.find('img[width="24"]').length).toBe(6);
        return expect(this.$element.find('img[height="24"]').length).toBe(6);
      });
    });
    describe('avatarClass', function() {
      it('should add "tweet-avatar" css class on the avatar image tag by default', function() {
        mockResponseWithOptions(this.$element);
        return expect(this.$element.find('ul > li > img.tweet-avatar').length).toBe(6);
      });
      return it('should add a custom css class on the avatar image if specified', function() {
        mockResponseWithOptions(this.$element, {
          avatarClass: 'custom-class'
        });
        expect(this.$element.find('ul > li > img.tweet-avatar').length).toBe(0);
        return expect(this.$element.find('ul > li > img.custom-class').length).toBe(6);
      });
    });
    describe('timeClass', function() {
      it('should add "tweet-time" css class on the span wrapping the time by default', function() {
        mockResponseWithOptions(this.$element);
        return expect(this.$element.find('ul > li > span.tweet-time').length).toBe(6);
      });
      return it('should add a custom css class on the span wrapping the time', function() {
        mockResponseWithOptions(this.$element, {
          timeClass: 'custom-class'
        });
        expect(this.$element.find('ul > li > span.custom-class').length).toBe(6);
        return expect(this.$element.find('ul > li > span.tweet-time').length).toBe(0);
      });
    });
    return describe('hideReplies', function() {
      it('should not hide replies by default', function() {
        mockResponseWithOptions(this.$element);
        return expect(this.$element.find('li').length).toBe(6);
      });
      return it('should hide replies when specified', function() {
        mockResponseWithOptions(this.$element, {
          hideReplies: true
        });
        return expect(this.$element.find('li').length).toBe(5);
      });
    });
  });
  return describe('callbacks', function() {
    beforeEach(function() {
      return this.callback = jasmine.createSpy('callback');
    });
    it('should call on load before loading the tweets', function() {
      new $.miniFeed(this.$element, {
        onLoad: this.callback
      });
      return expect(this.callback).toHaveBeenCalledWith(this.$element);
    });
    return it('should call on loaded when tweets have been loaded', function() {
      mockResponseWithOptions(this.$element, {
        onLoaded: this.callback
      });
      return expect(this.callback).toHaveBeenCalledWith(this.$element);
    });
  });
});
