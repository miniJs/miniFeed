describe 'miniFeed', ->  
  # server = sinon.fakeServer.create()
  # url = "https://api.twitter.com/1/statuses/user_timeline.json?screen_name=mattaussaguel&count=6&include_rts=true"
  # server.respondWith( "GET", url, [200, { "Content-Type": "application/json" },'[{ "id": 12, "comment": "Hey there" }]'] )
  # server.respond()

  twitterApiUrlPrefix = "http://api.twitter.com/1/statuses/user_timeline.json?"
  basicTwitterApiResponse = 
    [
      {
        created_at: "Sun Jul 01 00:00:00 +0000 2012"
        text: "some text"
        in_reply_to_status_id: null
        user:
          profile_image_url: "image.png"
      },
      {
        created_at: "Sun Jul 01 00:00:00 +0000 2012"
        text: "some text"
        in_reply_to_status_id: 1
        user:
          profile_image_url: "image.png"
      },
      {
        created_at: "Sun Jul 01 00:00:00 +0000 2012"
        text: "some text"
        in_reply_to_status_id: null
        user:
          profile_image_url: "image.png"
      },
      {
        created_at: "Sun Jul 01 00:00:00 +0000 2012"
        text: "some text"
        in_reply_to_status_id: null
        user:
          profile_image_url: "image.png"
      },
      {
        created_at: "Sun Jul 01 00:00:00 +0000 2012"
        text: "some text"
        in_reply_to_status_id: null
        user:
          profile_image_url: "image.png"
      },
      {
        created_at: "Sun Jul 01 00:00:00 +0000 2012"
        text: "some text"
        in_reply_to_status_id: null
        user:
          profile_image_url: "image.png"
      }
    ]

  beforeEach ->
    setFixtures '<div id="feed"></div>'
    @$element = $('#feed')
    spyOn($, 'getJSON')

  describe 'plugin behavior', ->
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

  describe 'api url construction', ->
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

    describe 'hide retweets', ->
      it 'should include retweets by default', ->
        new $.miniFeed( @$element )  

        url = "#{twitterApiUrlPrefix}screen_name=mattaussaguel&count=6&include_rts=true&callback=?"
        expect($.getJSON).toHaveBeenCalledWith( url, jasmine.any( Function ) )

      it 'should not include retweets if hideRetweets is true', ->
        new $.miniFeed( @$element, { hideRetweets: true} )  

        url = "#{twitterApiUrlPrefix}screen_name=mattaussaguel&count=6&callback=?"
        expect($.getJSON).toHaveBeenCalledWith( url, jasmine.any( Function ) )

  describe 'tweet format', ->
    describe 'introText', ->
      it 'should not add any intro text by default', ->
        new $.miniFeed( @$element )          

        $.getJSON.mostRecentCall.args[1]( basicTwitterApiResponse )
        expect( @$element.find('.tweet-text').first().text ).toHaveText( 'some text'

      describe 'with intro text', ->
        beforeEach ->
          new $.miniFeed( @$element, { introText: 'intro text - ' } )          
          $.getJSON.mostRecentCall.args[1]( basicTwitterApiResponse )

        it 'should prepend text with intro text', ->
          expect( @$element.find('.tweet-text').first().text() ).toBe 'intro text - some text' 

        it 'should wrap the intro text in a span with intro-text css class', ->
          expect( @$element.find('span.intro-text').first().text() ).toBe 'intro text - '

        it 'should add the intro to every tweet', ->
          expect( @$element.find('.tweet-text > span.intro-text').length ).toBe 6

    describe 'outroText', ->
      it 'should not add any outro text by default', ->
        new $.miniFeed( @$element )          

        $.getJSON.mostRecentCall.args[1]( basicTwitterApiResponse )
        expect( @$element.find('.tweet-text').first().text ).toHaveText( 'some text'

      describe 'with outro text', ->
        beforeEach ->
          new $.miniFeed( @$element, { outroText: ' - outro text' } )          
          $.getJSON.mostRecentCall.args[1]( basicTwitterApiResponse )

        it 'should prepend text with outro text', ->
          expect( @$element.find('.tweet-text').first().text() ).toBe 'some text - outro text' 

        it 'should wrap the outro text in a span with outro-text css class', ->
          expect( @$element.find('span.outro-text').first().text() ).toBe '- outro text'

        it 'should add the outro to every tweet', ->
          expect( @$element.find('.tweet-text > span.outro-text').length ).toBe 6

    # username links
    # links
    # timeFormat

  describe 'generated markup', ->
    describe 'listClass', ->
      it 'should generate a list item  with css class tweet-list by default', ->
        new $.miniFeed( @$element )
        $.getJSON.mostRecentCall.args[1]( basicTwitterApiResponse )

        expect( @$element.children('ul.tweet-list').first() ).toExist()

      it 'should generate list item with custom css class', ->
        new $.miniFeed( @$element, { listClass: 'custom-class' } )
        $.getJSON.mostRecentCall.args[1]( basicTwitterApiResponse )

        expect( @$element.children('ul').first() ).toHaveClass( 'custom-class' )
        expect( @$element.children('ul') ).not.toHaveClass( 'tweet-list' )

    describe 'firstClass', ->
      it 'should add "first" css class on the first tweet', ->
        new $.miniFeed( @$element )
        $.getJSON.mostRecentCall.args[1]( basicTwitterApiResponse )

        expect( @$element.find('li').first() ).toHaveClass( 'first' )

      it 'should add custom css class on the first tweet when specified', ->
        new $.miniFeed( @$element, { firstClass: 'custom-class' } )
        $.getJSON.mostRecentCall.args[1]( basicTwitterApiResponse )

        expect( @$element.find('li').first() ).toHaveClass( 'custom-class' )
        expect( @$element.find('li').first() ).not.toHaveClass( 'first' )


    describe 'lastClass', ->
      it 'should add "last" css class on the last tweet', ->
        new $.miniFeed( @$element )
        $.getJSON.mostRecentCall.args[1]( basicTwitterApiResponse )

        expect( @$element.find('li').last() ).toHaveClass( 'last' )

      it 'should add custom css class on the last tweet when specified', ->
        new $.miniFeed( @$element, { lastClass: 'custom-class' } )
        $.getJSON.mostRecentCall.args[1]( basicTwitterApiResponse )

        expect( @$element.find('li').last() ).toHaveClass( 'custom-class' )
        expect( @$element.find('li').last() ).not.toHaveClass( 'last' )

    describe 'tweetClass', ->
      it 'should add "tweet-text" css class on the text wrapper by default', ->
        new $.miniFeed( @$element )
        $.getJSON.mostRecentCall.args[1]( basicTwitterApiResponse )

        expect( @$element.find('ul > li > span.tweet-text').length ).toBe 6

      it 'should add a custom css class on the text wrapper when specified', ->
        new $.miniFeed( @$element, { tweetClass: 'custom-class' } )
        $.getJSON.mostRecentCall.args[1]( basicTwitterApiResponse )

        expect( @$element.find('ul > li > span.tweet-text').length ).toBe 0
        expect( @$element.find('ul > li > span.custom-class').length ).toBe 6

    describe 'avatarSize', ->
      it 'should add set the avatar width and height to 48px by default', ->
        new $.miniFeed( @$element )
        $.getJSON.mostRecentCall.args[1]( basicTwitterApiResponse )

        expect( @$element.find('img[width="48"]').length ).toBe 6
        expect( @$element.find('img[height="48"]').length ).toBe 6

      it 'should add set a custom avatar width and height when specified', ->
        new $.miniFeed( @$element, { avatarSize: 24 } )
        $.getJSON.mostRecentCall.args[1]( basicTwitterApiResponse )

        expect( @$element.find('img[width="24"]').length ).toBe 6
        expect( @$element.find('img[height="24"]').length ).toBe 6


    describe 'avatarClass', ->
      it 'should add "tweet-avatar" css class on the avatar image tag by default', ->
        new $.miniFeed( @$element )
        $.getJSON.mostRecentCall.args[1]( basicTwitterApiResponse )

        expect( @$element.find('ul > li > img.tweet-avatar').length ).toBe 6

      it 'should add a custom css class on the avatar image if specified', ->
        new $.miniFeed( @$element, { avatarClass: 'custom-class' } )
        $.getJSON.mostRecentCall.args[1]( basicTwitterApiResponse )

        expect( @$element.find('ul > li > img.tweet-avatar').length ).toBe 0
        expect( @$element.find('ul > li > img.custom-class').length ).toBe 6

    describe 'timeClass', ->
      it 'should add "tweet-time" css class on the span wrapping the time by default', ->
        new $.miniFeed( @$element )
        $.getJSON.mostRecentCall.args[1]( basicTwitterApiResponse )

        expect( @$element.find('ul > li > span.tweet-time').length ).toBe 6

      it 'should add a custom css class on the span wrapping the time', ->
        new $.miniFeed( @$element, { timeClass: 'custom-class' } )
        $.getJSON.mostRecentCall.args[1]( basicTwitterApiResponse )

        expect( @$element.find('ul > li > span.custom-class').length ).toBe 6
        expect( @$element.find('ul > li > span.tweet-time').length ).toBe 0

    describe 'hideReplies', ->
      it 'should not hide replies by default', ->
        new $.miniFeed( @$element )
        $.getJSON.mostRecentCall.args[1]( basicTwitterApiResponse )

        expect( @$element.find('li').length ).toBe 6

      it 'should hide replies when specified', ->
        new $.miniFeed( @$element, hideReplies: true )
        $.getJSON.mostRecentCall.args[1]( basicTwitterApiResponse )

        expect( @$element.find('li').length ).toBe 5

  describe 'callbacks', ->
    beforeEach ->
      @callback = jasmine.createSpy( 'callback' )

    it 'should call on load before loading the tweets', ->
      new $.miniFeed( @$element, { onLoad: @callback } )  

      expect( @callback ).toHaveBeenCalledWith(@$element)

    it 'should call on loaded when tweets have been loaded', ->
      new $.miniFeed( @$element, { onLoaded: @callback } )  
      $.getJSON.mostRecentCall.args[1]({})

      expect( @callback ).toHaveBeenCalledWith(@$element)