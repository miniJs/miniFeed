describe 'miniFeed', ->  
  beforeEach ->
    setFixtures '<div id="feed"></div>'
    @$element = $('#feed')

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
    # username
    # limit

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
    # onLoad
    # onLoaded


