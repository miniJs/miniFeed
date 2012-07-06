(function() {

  describe('miniFeed', function() {
    var mockResponse, twitterApiUrlPrefix;
    twitterApiUrlPrefix = "http://api.twitter.com/1/statuses/user_timeline.json?";
    mockResponse = {
      username: 'mattaussaguel'
    };
    beforeEach(function() {
      setFixtures('<div id="feed"></div>');
      return this.$element = $('#feed');
    });
    describe('plugin behavior', function() {
      beforeEach(function() {
        return spyOn($, 'getJSON');
      });
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
    describe('configuration', function() {
      beforeEach(function() {
        return spyOn($, 'getJSON');
      });
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
      return describe('limit option', function() {
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
    });
    describe('tweet format', function() {});
    describe('generated markup', function() {});
    describe('restrictions', function() {});
    return describe('callbacks', function() {
      beforeEach(function() {
        return this.callback = jasmine.createSpy('callback');
      });
      it('should call on load before loading the tweets', function() {
        spyOn($, 'getJSON');
        new $.miniFeed(this.$element, {
          onLoad: this.callback
        });
        return expect(this.callback).toHaveBeenCalledWith(this.$element);
      });
      return it('should call on loaded when tweets have been loaded', function() {
        spyOn($, 'getJSON');
        new $.miniFeed(this.$element, {
          onLoaded: this.callback
        });
        $.getJSON.mostRecentCall.args[1]({});
        return expect(this.callback).toHaveBeenCalledWith(this.$element);
      });
    });
  });

}).call(this);
