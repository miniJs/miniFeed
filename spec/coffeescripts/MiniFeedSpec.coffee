describe 'miniFeed', ->
  twitterApiUrlPrefix = "http://twitcher.steer.me/user_timeline"
  basicTwitterApiResponse =
    [
      {
        created_at: "Sun Jul 01 00:00:00 +0000 2012"
        text: "some text"
        in_reply_to_status_id: null
        user:
          profile_image_url_https: "image.png"
      },
      {
        created_at: "Sun Jul 01 00:00:00 +0000 2012"
        text: "some text"
        in_reply_to_status_id: 1
        user:
          profile_image_url_https: "image.png"
      },
      {
        created_at: "Sun Jul 01 00:00:00 +0000 2012"
        text: "some text"
        in_reply_to_status_id: null
        user:
          profile_image_url_https: "image.png"
      },
      {
        created_at: "Sun Jul 01 00:00:00 +0000 2012"
        text: "some text"
        in_reply_to_status_id: null
        user:
          profile_image_url_https: "image.png"
      },
      {
        created_at: "Sun Jul 01 00:00:00 +0000 2012"
        text: "some text"
        in_reply_to_status_id: null
        user:
          profile_image_url_https: "image.png"
      },
      {
        created_at: "Sun Jul 01 00:00:00 +0000 2012"
        text: "some text @jquery some text http://jquery.com some text #jquery"
        in_reply_to_status_id: null
        user:
          profile_image_url_https: "image.png"
      }
    ]

  mockResponseWithOptions = (@$element, options = {} ) ->
    plugin = new $.miniFeed( @$element, options )
    $.getJSON.mostRecentCall.args[1]( basicTwitterApiResponse )
    plugin


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
    it 'should fetch the last tweets for mattaussaguel by default', ->
      new $.miniFeed( @$element )

      url = "#{twitterApiUrlPrefix}/mattaussaguel"
      expect($.getJSON).toHaveBeenCalledWith( url, jasmine.any( Function ) )


  describe 'tweet format', ->
    describe 'introText', ->
      it 'should not add any intro text by default', ->
        mockResponseWithOptions( @$element )

        expect( @$element.find('.tweet-text').first().text() ).toBe( 'some text' )

      describe 'with intro text', ->
        beforeEach ->
          mockResponseWithOptions( @$element, { introText: 'intro text - ' } )

        it 'should prepend text with intro text', ->
          expect( @$element.find('.tweet-text').first().text() ).toBe 'intro text - some text'

        it 'should wrap the intro text in a span with intro-text css class', ->
          expect( @$element.find('span.intro-text').first().text() ).toBe 'intro text - '

        it 'should add the intro to every tweet', ->
          expect( @$element.find('.tweet-text > span.intro-text').length ).toBe 6

    describe 'outroText', ->
      it 'should not add any outro text by default', ->
        mockResponseWithOptions( @$element )

        expect( @$element.find('.tweet-text').first().text() ).toBe( 'some text' )

      describe 'with outro text', ->
        beforeEach ->
          mockResponseWithOptions( @$element, { outroText: ' - outro text' } )

        it 'should prepend text with outro text', ->
          expect( @$element.find('.tweet-text').first().text() ).toBe 'some text - outro text'

        it 'should wrap the outro text in a span with outro-text css class', ->
          expect( @$element.find('span.outro-text').first().text() ).toBe ' - outro text'

        it 'should add the outro to every tweet', ->
          expect( @$element.find('.tweet-text > span.outro-text').length ).toBe 6

    describe 'template', ->
      it 'should render every tweet using the default template', ->
        mockResponseWithOptions( @$element )

        $tweet = @$element.find( 'ul > li' ).first()
        expect( $tweet.children().length ).toBe 3
        expect( $tweet.children()[0] ).toHaveClass 'tweet-avatar'
        expect( $tweet.children()[1] ).toHaveClass 'tweet-text'
        expect( $tweet.children()[2] ).toHaveClass 'tweet-time'

      it 'should be able to render template in a different order', ->
        mockResponseWithOptions( @$element, { template: '{time}{avatar}{tweet}' } )

        $tweet = @$element.find( 'ul > li' ).first()
        expect( $tweet.children().length ).toBe 3
        expect( $tweet.children()[0] ).toHaveClass 'tweet-time'
        expect( $tweet.children()[1] ).toHaveClass 'tweet-avatar'
        expect( $tweet.children()[2] ).toHaveClass 'tweet-text'

      it 'should be able to render only 2 elements', ->
        mockResponseWithOptions( @$element, { template: '{tweet}{avatar}' } )

        $tweet = @$element.find( 'ul > li' ).first()
        expect( $tweet.children().length ).toBe 2
        expect( $tweet.children()[0] ).toHaveClass 'tweet-text'
        expect( $tweet.children()[1] ).toHaveClass 'tweet-avatar'

      it 'should be able to render only 1 element', ->
        mockResponseWithOptions( @$element, { template: '{tweet}' } )

        $tweet = @$element.find( 'ul > li' ).first()
        expect( $tweet.children().length ).toBe 1
        expect( $tweet.children()[0] ).toHaveClass 'tweet-text'

      it 'should be able to render without elements', ->
        mockResponseWithOptions( @$element, { template: '' } )

        $tweet = @$element.find( 'ul > li' ).first()
        expect( $tweet.children().length ).toBe 0

    describe 'links', ->
      beforeEach ->
        mockResponseWithOptions( @$element )
        @$tweet = @$element.find('li:last > .tweet-text').first()

      it 'should link usernames to twitter profile page', ->
        $link = @$tweet.find( 'a.mini-feed-user-link' )

        expect( $link ).toExist()
        expect( $link.text() ).toBe '@jquery'
        expect( $link.attr('href') ).toBe 'http://www.twitter.com/jquery'

      it 'should link links', ->
        $link = @$tweet.find( 'a.mini-feed-link' )

        expect( $link ).toExist()
        expect( $link.text() ).toBe 'http://jquery.com'
        expect( $link.attr('href') ).toBe 'http://jquery.com'

      it 'should link hashtags', ->
        expect( @$tweet.html() ).toContain '<a href="http://search.twitter.com/search?q=&amp;tag=jquery&amp;lang=all">#jquery</a>'

    describe 'timeFormat', ->
      it 'should display the time in a relative format by default', ->
        mockResponseWithOptions( @$element )

        expect( @$element.find('.tweet-time').first().text() ).toMatch /ago$/

      it 'should display the time in a classic format when specified', ->
        mockResponseWithOptions( @$element, { timeFormat: 'normal' } )

        expect( @$element.find('.tweet-time').first().text() ).not.toMatch /ago$/

  describe 'generated markup', ->
    describe 'listClass', ->
      it 'should generate a list item  with css class tweet-list by default', ->
        mockResponseWithOptions( @$element )

        expect( @$element.children('ul.tweet-list').first() ).toExist()

      it 'should generate list item with custom css class', ->
        mockResponseWithOptions( @$element, { listClass: 'custom-class' } )

        expect( @$element.children('ul').first() ).toHaveClass( 'custom-class' )
        expect( @$element.children('ul') ).not.toHaveClass( 'tweet-list' )

    describe 'firstClass', ->
      it 'should add "first" css class on the first tweet', ->
        mockResponseWithOptions( @$element, { listClass: 'custom-class' } )

        expect( @$element.find('li').first() ).toHaveClass( 'first' )

      it 'should add custom css class on the first tweet when specified', ->
        mockResponseWithOptions( @$element, { firstClass: 'custom-class' } )

        expect( @$element.find('li').first() ).toHaveClass( 'custom-class' )
        expect( @$element.find('li').first() ).not.toHaveClass( 'first' )


    describe 'lastClass', ->
      it 'should add "last" css class on the last tweet', ->
        mockResponseWithOptions( @$element )

        expect( @$element.find('li').last() ).toHaveClass( 'last' )

      it 'should add custom css class on the last tweet when specified', ->
        mockResponseWithOptions( @$element, { lastClass: 'custom-class' } )

        expect( @$element.find('li').last() ).toHaveClass( 'custom-class' )
        expect( @$element.find('li').last() ).not.toHaveClass( 'last' )

    describe 'tweetClass', ->
      it 'should add "tweet-text" css class on the text wrapper by default', ->
        mockResponseWithOptions( @$element )

        expect( @$element.find('ul > li > span.tweet-text').length ).toBe 6

      it 'should add a custom css class on the text wrapper when specified', ->
        mockResponseWithOptions( @$element, { tweetClass: 'custom-class' } )

        expect( @$element.find('ul > li > span.tweet-text').length ).toBe 0
        expect( @$element.find('ul > li > span.custom-class').length ).toBe 6

    describe 'avatarSize', ->
      it 'should add set the avatar width and height to 48px by default', ->
        mockResponseWithOptions( @$element )

        expect( @$element.find('img[width="48"]').length ).toBe 6
        expect( @$element.find('img[height="48"]').length ).toBe 6

      it 'should add set a custom avatar width and height when specified', ->
        mockResponseWithOptions( @$element, { avatarSize: 24 } )


        expect( @$element.find('img[width="24"]').length ).toBe 6
        expect( @$element.find('img[height="24"]').length ).toBe 6


    describe 'avatarClass', ->
      it 'should add "tweet-avatar" css class on the avatar image tag by default', ->
        mockResponseWithOptions( @$element )

        expect( @$element.find('ul > li > img.tweet-avatar').length ).toBe 6

      it 'should add a custom css class on the avatar image if specified', ->
        mockResponseWithOptions( @$element, { avatarClass: 'custom-class' } )

        expect( @$element.find('ul > li > img.tweet-avatar').length ).toBe 0
        expect( @$element.find('ul > li > img.custom-class').length ).toBe 6

    describe 'timeClass', ->
      it 'should add "tweet-time" css class on the span wrapping the time by default', ->
        mockResponseWithOptions( @$element )

        expect( @$element.find('ul > li > span.tweet-time').length ).toBe 6

      it 'should add a custom css class on the span wrapping the time', ->
        mockResponseWithOptions( @$element, { timeClass: 'custom-class' } )

        expect( @$element.find('ul > li > span.custom-class').length ).toBe 6
        expect( @$element.find('ul > li > span.tweet-time').length ).toBe 0

    describe 'hideReplies', ->
      it 'should not hide replies by default', ->
        mockResponseWithOptions( @$element )

        expect( @$element.find('li').length ).toBe 6

      it 'should hide replies when specified', ->
        mockResponseWithOptions( @$element, { hideReplies: true } )

        expect( @$element.find('li').length ).toBe 5

  describe 'callbacks', ->
    beforeEach ->
      @callback = jasmine.createSpy( 'callback' )

    it 'should call on load before loading the tweets', ->
      new $.miniFeed( @$element, { onLoad: @callback } )

      expect( @callback ).toHaveBeenCalledWith(@$element)

    it 'should call on loaded when tweets have been loaded', ->
      mockResponseWithOptions( @$element, { onLoaded: @callback } )

      expect( @callback ).toHaveBeenCalledWith(@$element)
