#
# miniFeed, the Twitter plugin for jQuery
# Instructions: Coming Soon
# By: Matthieu Aussaguel, http://www.mynameismatthieu.com, @matthieu_tweets
# Version: 0.1 alpha 1.0
# Updated: July 6th, 2011
#

$ ->
  $.miniFeed = (element, options) ->
    # default plugin settings
    @defaults = {
      username:             'mattaussaguel'                  # twitter username
      list:                 null                             # list name to get the tweets from
      limit:                6                                # number of tweets to be displayed

      template:             '{avatar}{tweet}{date}{time}'    # tweet format
      introText:            null                             # text to prepend every tweet
      outroText:            null                             # text to append every tweet

      className:            'mini-feed'                      # class added to the <ul/> generated element
      firstClass:           'first'                          # class added to the first tweet
      lastClass:            'last'                           # class added to the last tweet

      avatarSize:           '48px'                           # avatar size in pixels

      showRetweets:         true                             # show account retweets

      showOnlyFavorites:    true                             # show account favorites

      timeFormat:           'normal'                         # time format 'normal' | 'elapsed'
      timeClass:            null                             # class added to the time wrapper
      dateClass:            null                             # class added to the date wrapper

      onLoad:               ->                               # Function() called when the tweets are loading,
      onVisible:            ->                               # Function(feed) called when miniTweet is hidden

      showAnimateProperties: {}                               # animate properties on show, will fadeIn by default
    }

    ## private variables
    # current state
    state = ''

    # show animate properties
    showAnimateProperties = { opacity : 1 }

    ## public variables
    # plugin settings
    @settings = {}

    # jQuery version of DOM element attached to the plugin
    @$element = $ element

    ## private methods
    # set current state
    setState = (_state) ->
      state = _state

    make_url = =>
      url = "http://api.twitter.com/"
      if @getSetting('list')? 
        url += "1/#{@getSetting('username')}/lists/#{@getSetting('list')}/statuses.json?"
      else if @getSetting('showOnlyFavorites')? 
        url += "favorites/#{@getSetting('username')}.json?"
      else
        url =  "http://api.twitter.com/1/statuses/user_timeline.json?"
        url += "screen_name=#{@getSetting('username')}"
      url += "&count=#{@getSetting('limit')}"
      url += "&include_rts=1" if @getSetting('showRetweets')
      url += "&callback=?"

    ## public methods
    #get current state
    @getState = ->
      state

    # get particular plugin setting
    @getSetting = (settingKey) ->
      @settings[settingKey]

    # call one of the plugin setting functions
    @callSettingFunction = (functionName) ->
      @settings[functionName]()

    # init function
    @init = ->
      @settings = $.extend {}, @defaults, options
      $.getJSON(make_url(), (data) ->
        console.log data
      )

    # end init method

    # initialise the plugin
    @init()

  $.fn.miniFeed = (options) ->
    return this.each ->
      if  $(this).data('miniFeed') is undefined
        plugin = new $.miniFeed this, options
        $(this).data('miniFeed', plugin)