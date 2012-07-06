(function() {

  describe('miniFeed', function() {
    var basicTwitterApiResponse, twitterApiUrlPrefix;
    twitterApiUrlPrefix = "http://api.twitter.com/1/statuses/user_timeline.json?";
    basicTwitterApiResponse = [
      {
        created_at: "Sun Jul 01 00:00:00 +0000 2012",
        text: "some text",
        in_reply_to_status_id: null,
        user: {
          profile_image_url: "image.png"
        }
      }, {
        created_at: "Sun Jul 01 00:00:00 +0000 2012",
        text: "some text",
        in_reply_to_status_id: 1,
        user: {
          profile_image_url: "image.png"
        }
      }, {
        created_at: "Sun Jul 01 00:00:00 +0000 2012",
        text: "some text",
        in_reply_to_status_id: null,
        user: {
          profile_image_url: "image.png"
        }
      }, {
        created_at: "Sun Jul 01 00:00:00 +0000 2012",
        text: "some text",
        in_reply_to_status_id: null,
        user: {
          profile_image_url: "image.png"
        }
      }, {
        created_at: "Sun Jul 01 00:00:00 +0000 2012",
        text: "some text",
        in_reply_to_status_id: null,
        user: {
          profile_image_url: "image.png"
        }
      }, {
        created_at: "Sun Jul 01 00:00:00 +0000 2012",
        text: "some text",
        in_reply_to_status_id: null,
        user: {
          profile_image_url: "image.png"
        }
      }
    ];
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
      return describe('introText', function() {
        it('should not add any intro text by default', function() {
          new $.miniFeed(this.$element);
          $.getJSON.mostRecentCall.args[1](basicTwitterApiResponse);
          return expect(this.$element.find('.tweet-text').first()).toHaveText('some text');
        });
        return describe('with intro text', function() {
          beforeEach(function() {
            new $.miniFeed(this.$element, {
              introText: 'intro text - '
            });
            return $.getJSON.mostRecentCall.args[1](basicTwitterApiResponse);
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
    });
    describe('generated markup', function() {
      describe('listClass', function() {
        it('should generate a list item  with css class tweet-list by default', function() {
          new $.miniFeed(this.$element);
          $.getJSON.mostRecentCall.args[1](basicTwitterApiResponse);
          return expect(this.$element.children('ul.tweet-list').first()).toExist();
        });
        return it('should generate list item with custom css class', function() {
          new $.miniFeed(this.$element, {
            listClass: 'custom-class'
          });
          $.getJSON.mostRecentCall.args[1](basicTwitterApiResponse);
          expect(this.$element.children('ul').first()).toHaveClass('custom-class');
          return expect(this.$element.children('ul')).not.toHaveClass('tweet-list');
        });
      });
      describe('firstClass', function() {
        it('should add "first" css class on the first tweet', function() {
          new $.miniFeed(this.$element);
          $.getJSON.mostRecentCall.args[1](basicTwitterApiResponse);
          return expect(this.$element.find('li').first()).toHaveClass('first');
        });
        return it('should add custom css class on the first tweet when specified', function() {
          new $.miniFeed(this.$element, {
            firstClass: 'custom-class'
          });
          $.getJSON.mostRecentCall.args[1](basicTwitterApiResponse);
          expect(this.$element.find('li').first()).toHaveClass('custom-class');
          return expect(this.$element.find('li').first()).not.toHaveClass('first');
        });
      });
      describe('lastClass', function() {
        it('should add "last" css class on the last tweet', function() {
          new $.miniFeed(this.$element);
          $.getJSON.mostRecentCall.args[1](basicTwitterApiResponse);
          return expect(this.$element.find('li').last()).toHaveClass('last');
        });
        return it('should add custom css class on the last tweet when specified', function() {
          new $.miniFeed(this.$element, {
            lastClass: 'custom-class'
          });
          $.getJSON.mostRecentCall.args[1](basicTwitterApiResponse);
          expect(this.$element.find('li').last()).toHaveClass('custom-class');
          return expect(this.$element.find('li').last()).not.toHaveClass('last');
        });
      });
      describe('tweetClass', function() {
        it('should add "tweet-text" css class on the text wrapper by default', function() {
          new $.miniFeed(this.$element);
          $.getJSON.mostRecentCall.args[1](basicTwitterApiResponse);
          return expect(this.$element.find('ul > li > span.tweet-text').length).toBe(6);
        });
        return it('should add a custom css class on the text wrapper when specified', function() {
          new $.miniFeed(this.$element, {
            tweetClass: 'custom-class'
          });
          $.getJSON.mostRecentCall.args[1](basicTwitterApiResponse);
          expect(this.$element.find('ul > li > span.tweet-text').length).toBe(0);
          return expect(this.$element.find('ul > li > span.custom-class').length).toBe(6);
        });
      });
      describe('avatarSize', function() {
        it('should add set the avatar width and height to 48px by default', function() {
          new $.miniFeed(this.$element);
          $.getJSON.mostRecentCall.args[1](basicTwitterApiResponse);
          expect(this.$element.find('img[width="48"]').length).toBe(6);
          return expect(this.$element.find('img[height="48"]').length).toBe(6);
        });
        return it('should add set a custom avatar width and height when specified', function() {
          new $.miniFeed(this.$element, {
            avatarSize: 24
          });
          $.getJSON.mostRecentCall.args[1](basicTwitterApiResponse);
          expect(this.$element.find('img[width="24"]').length).toBe(6);
          return expect(this.$element.find('img[height="24"]').length).toBe(6);
        });
      });
      describe('avatarClass', function() {
        it('should add "tweet-avatar" css class on the avatar image tag by default', function() {
          new $.miniFeed(this.$element);
          $.getJSON.mostRecentCall.args[1](basicTwitterApiResponse);
          return expect(this.$element.find('ul > li > img.tweet-avatar').length).toBe(6);
        });
        return it('should add a custom css class on the avatar image if specified', function() {
          new $.miniFeed(this.$element, {
            avatarClass: 'custom-class'
          });
          $.getJSON.mostRecentCall.args[1](basicTwitterApiResponse);
          expect(this.$element.find('ul > li > img.tweet-avatar').length).toBe(0);
          return expect(this.$element.find('ul > li > img.custom-class').length).toBe(6);
        });
      });
      describe('timeClass', function() {
        it('should add "tweet-time" css class on the span wrapping the time by default', function() {
          new $.miniFeed(this.$element);
          $.getJSON.mostRecentCall.args[1](basicTwitterApiResponse);
          return expect(this.$element.find('ul > li > span.tweet-time').length).toBe(6);
        });
        return it('should add a custom css class on the span wrapping the time', function() {
          new $.miniFeed(this.$element, {
            timeClass: 'custom-class'
          });
          $.getJSON.mostRecentCall.args[1](basicTwitterApiResponse);
          expect(this.$element.find('ul > li > span.custom-class').length).toBe(6);
          return expect(this.$element.find('ul > li > span.tweet-time').length).toBe(0);
        });
      });
      return describe('hideReplies', function() {
        it('should not hide replies by default', function() {
          new $.miniFeed(this.$element);
          $.getJSON.mostRecentCall.args[1](basicTwitterApiResponse);
          return expect(this.$element.find('li').length).toBe(6);
        });
        return it('should hide replies when specified', function() {
          new $.miniFeed(this.$element, {
            hideReplies: true
          });
          $.getJSON.mostRecentCall.args[1](basicTwitterApiResponse);
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
        new $.miniFeed(this.$element, {
          onLoaded: this.callback
        });
        $.getJSON.mostRecentCall.args[1]({});
        return expect(this.callback).toHaveBeenCalledWith(this.$element);
      });
    });
  });

}).call(this);
