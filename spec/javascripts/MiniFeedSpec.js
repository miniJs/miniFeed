(function() {

  describe('miniFeed', function() {
    beforeEach(function() {
      setFixtures('<div id="feed"></div>');
      return this.$element = $('#feed');
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
    it('should overwrites the settings', function() {
      var options, plugin;
      options = {
        username: 'test',
        limit: 4
      };
      plugin = new $.miniFeed(this.$element, options);
      expect(plugin.settings.username).toBe(options.username);
      return expect(plugin.settings.limit).toBe(options.limit);
    });
    describe('configuration', function() {});
    describe('tweet format', function() {});
    describe('generated markup', function() {});
    describe('restrictions', function() {});
    return describe('callbacks', function() {});
  });

}).call(this);
