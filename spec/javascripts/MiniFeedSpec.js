(function() {

  describe('miniFeed', function() {
    var options;
    options = {
      username: 'test'
    };
    beforeEach(function() {
      loadFixtures('fragment.html');
      return this.$element = $('#fixtures');
    });
    it('should be available on the jQuery object', function() {
      return expect($.fn.miniFeed).toBeDefined();
    });
    it('should be chainable', function() {
      return expect(this.$element.miniFeed(options)).toBe(this.$element);
    });
    it('should offer default values', function() {
      var plugin;
      plugin = new $.miniFeed(this.$element[0], options);
      return expect(plugin.defaults).toBeDefined();
    });
    return it('should overwrites the settings', function() {
      var plugin;
      plugin = new $.miniFeed(this.$element[0], options);
      return expect(plugin.settings.username).toBe(options.username);
    });
  });

}).call(this);
