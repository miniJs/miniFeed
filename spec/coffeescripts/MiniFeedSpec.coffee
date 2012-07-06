describe 'miniFeed', ->  
  # server = sinon.fakeServer.create()
  # url = "https://api.twitter.com/1/statuses/user_timeline.json?screen_name=mattaussaguel&count=6&include_rts=true"
  # server.respondWith( "GET", url, [200, { "Content-Type": "application/json" },'[{ "id": 12, "comment": "Hey there" }]'] )
  # server.respond()

  twitterApiUrlPrefix = "http://api.twitter.com/1/statuses/user_timeline.json?"

  beforeEach ->
    setFixtures '<div id="feed"></div>'
    @$element = $('#feed')

  describe 'plugin behavior', ->
    beforeEach ->
      spyOn($, 'getJSON')

    it 'should be available on the jQuery object', ->
      expect( $.fn.miniFeed ).toBeDefined()

    it 'should be chainable', ->
      expect( @$element.miniFeed() ).toBe @$element 

    it 'should offer default values', ->
      plugin = new $.miniFeed @$element

      expect( plugin.defaults ).toBeDefined()

    it 'should overwrites the settings', ->
      options = 
        username: 'test'
        limit: 4
      plugin = new $.miniFeed( @$element, options )

      expect( plugin.settings.username ).toBe options.username
      expect( plugin.settings.limit ).toBe options.limit

  describe 'configuration', ->
    beforeEach ->
      spyOn($, 'getJSON')

    describe 'username option', ->
      it 'should fetch the last tweets for mattaussaguel by default', ->
        new $.miniFeed( @$element )  

        url = "#{twitterApiUrlPrefix}screen_name=mattaussaguel&count=6&include_rts=true&callback=?"
        expect($.getJSON).toHaveBeenCalledWith( url, jasmine.any( Function ) )

      it 'should fetch the last tweets for a custom user if specified', ->
        new $.miniFeed( @$element, { username: 'foo'} )  

        url = "#{twitterApiUrlPrefix}screen_name=foo&count=6&include_rts=true&callback=?"
        expect($.getJSON).toHaveBeenCalledWith( url, jasmine.any( Function ) )

    describe 'limit option', ->
      it 'should fetch the last 6 tweets by default', ->
        new $.miniFeed( @$element )  

        url = "#{twitterApiUrlPrefix}screen_name=mattaussaguel&count=6&include_rts=true&callback=?"
        expect($.getJSON).toHaveBeenCalledWith( url, jasmine.any( Function ) )

      it 'should fetch the last n tweets when specified', ->
        new $.miniFeed( @$element, { limit: 10} )  

        url = "#{twitterApiUrlPrefix}screen_name=mattaussaguel&count=10&include_rts=true&callback=?"
        expect($.getJSON).toHaveBeenCalledWith( url, jasmine.any( Function ) )

  describe 'tweet format', ->
    # template
    # intro text
    # outro text
    # timeFormat

  describe 'generated markup', ->
    # listClass
    # firstClass
    # lastClass
    # tweetClass
    # avatarSize
    # avatarClass
    # timeClass

  describe 'restrictions', ->
    # hideRetweets
    # hideReplies

  describe 'callbacks', ->
    beforeEach ->
      @callback = jasmine.createSpy( 'callback' )

    it 'should call on load before loading the tweets', ->
      spyOn( $, 'getJSON' )
      new $.miniFeed( @$element, { onLoad: @callback } )  

      expect( @callback ).toHaveBeenCalled()

    # onLoaded


