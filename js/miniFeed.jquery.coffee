#
# miniFeed, the Twitter plugin for jQuery
# Instructions: Coming Soon
# By: Matthieu Aussaguel, http://www.mynameismatthieu.com, @matthieu_tweets
# Version: 0.1 alpha 1.0
# Updated: February 11, 2012
#

class Tweet
  # Class variables
  @urlRegex:  -> /((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi
  @userRegex: -> /[\@]+([A-Za-z0-9-_]+)/gi
  @hashRegex: -> /\s[\#]+([A-Za-z0-9-_]+)/gi

  constructor: (@tweet, @options) ->

  formatText: ->
    tweet = @tweet.text
    tweet = tweet.replace(Tweet.urlRegex(),"<a class=\"mini-feed-link\" href=\"$1\">$1</a>");
    tweet = tweet.replace(Tweet.userRegex(),"<a class=\"mini-feed-user-link\" href=\"http://www.twitter.com/$1\"><span>@</span>$1</a>");
    tweet.replace(Tweet.hashRegex(), "<a href=\"http://search.twitter.com/search?q=&tag=$1&lang=all\">#$1</a>")

  format: ->
    tweet =  ""
    tweet += @options.introText unless @options.introText is null
    tweet += @formatText()
    tweet += @options.outroText unless @options.outroText is null
    

  cssClass: (index, size) ->
    return @options.firstClass if index is 0
    return @options.lastClass  if index is (size - 1)

  # Class methods
  @apiUrl: (username, limit, showRetweets) ->
    apiUrl =  "http://api.twitter.com/1/statuses/user_timeline.json?"
    apiUrl += "screen_name=#{username}"
    apiUrl += "&count=#{limit}"
    apiUrl += "&include_rts=1" if showRetweets
    apiUrl += "&callback=?"
    apiUrl

  @formattedTweets: (tweets) ->
    $ul = $("<ul />")
    size = tweets.length
    for tweet, index in tweets
      $("<li />", {"html" : tweet.format(), "class" : tweet.cssClass(index, size)}).appendTo($ul) 
    $ul   

$ ->
  $.miniFeed = (element, options) ->
    # default plugin settings
    @defaults = {
      username:             'mattaussaguel'                  # twitter username
      limit:                6                                # number of tweets to be displayed

      template:             '{avatar}{tweet}{date}{time}'    # tweet format
      introText:            null                             # text to prepend every tweet
      outroText:            null                             # text to append every tweet

      className:            'mini-feed'                      # class added to the <ul/> generated element
      firstClass:           'first'                          # class added to the first tweet
      lastClass:            'last'                           # class added to the last tweet

      avatarSize:           '48px'                           # avatar size in pixels

      showRetweets:         true                             # show account retweets

      showTime:             true                             # show time after every tweet
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

    # an array of Tweet
    tweets = []

    # show animate properties
    showAnimateProperties = { opacity : 1 }

    ## public variables
    # plugin settings
    @settings = {}

    # jQuery version of DOM element attached to the plugin
    @$element = $ element

    ## private methods
    # set current state
    setState = (_state) -> state = _state      

    tweetFactory = (data) => tweets.push new Tweet(tweet, @settings) for tweet in data

    showTweets = => 
      setState 'loading'

      # fetch the tweets
      $.getJSON(Tweet.apiUrl(@getSetting('username'), @getSetting('limit'), @getSetting('showRetweets')), (data) ->
        setState 'formatting'
        tweetFactory(data)
        $(element).append(Tweet.formattedTweets(tweets))
        setState 'loaded'
      )

    ## public methods
    #get current state
    @getState = -> state

    @getTweets = -> tweets

    # get particular plugin setting
    @getSetting = (settingKey) -> @settings[settingKey]

    # call one of the plugin setting functions
    @callSettingFunction = (functionName) -> @settings[functionName]()

    # init function
    @init = ->
      @settings = $.extend {}, @defaults, options

      setState 'initialising'

      showTweets()

    # initialise the plugin
    @init()

  $.fn.miniFeed = (options) ->
    return this.each ->
      if  $(this).data('miniFeed') is undefined
        plugin = new $.miniFeed this, options
        $(this).data('miniFeed', plugin)