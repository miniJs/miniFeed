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

  avatar_url: -> @tweet.user.profile_image_url

  formatText: ->
    tweet = @tweet.text
    tweet = tweet.replace(Tweet.urlRegex(),"<a class=\"mini-feed-link\" href=\"$1\">$1</a>");
    tweet = tweet.replace(Tweet.userRegex(),"<a class=\"mini-feed-user-link\" href=\"http://www.twitter.com/$1\"><span>@</span>$1</a>");
    tweet.replace(Tweet.hashRegex(), "<a href=\"http://search.twitter.com/search?q=&tag=$1&lang=all\">#$1</a>")

  format: ->
    tweet =  ''
    tweet += "<span class='intro-text'>#{@options.introText}</span>" unless @options.introText is null
    tweet += @formatText()
    tweet += "<span class='outro-text'>#{@options.outroText}</span>" unless @options.outroText is null
    tweet
    
  cssClass: (index, size) ->
    return @options.firstClass if index is 0
    return @options.lastClass  if index is (size - 1)

  # class methods
  @apiUrl: (options) ->
    apiUrl =  "http://api.twitter.com/1/statuses/user_timeline.json?"
    apiUrl += "screen_name=#{options.username}"
    apiUrl += "&count=#{options.limit}"
    apiUrl += "&include_rts=1" if options.showRetweets
    apiUrl += "&callback=?"
    apiUrl

class TweetCollection
  constructor: (apiData, @options) ->
    @tweets = []
    @tweets.push(new Tweet(tweet, @options)) for tweet in apiData

  size: -> @tweets.length

  firstTweet: -> @tweets[0]

  avatar: ->
    avatarImage = null
    avatarImage = $('<img />', { 'src': @firstTweet().avatar_url(), 'title': @options.username, 'height': @options.avatarSize, 'width': @options.avatarSize}) unless @size is 0
    avatarImage
  
  list: ->
    $ul = $("<ul />", { "class": @options.className })
    for tweet, index in @tweets
      $("<li />", {"html" : tweet.format(), "class" : tweet.cssClass(index, @size)}).appendTo($ul) 
    $ul

  formattedTweets: ->
    $wrapper = $("<div />", { "class": @options.className })
    $wrapper.append(@avatar()) if @options.showAvatar
    $wrapper.append(@list())
    $wrapper

$ ->
  $.miniFeed = (element, options) ->
    # default plugin settings
    @defaults = {
      username:             'mattaussaguel'                  # twitter username
      limit:                4                                # number of tweets to be displayed

      template:             '{avatar}{tweet}{date}{time}'    # tweet format
      introText:            null                             # text to prepend every tweet
      outroText:            null                             # text to append every tweet

      className:            'tweet-list'                     # class added to the wrapper
      firstClass:           'first'                          # class added to the first tweet
      lastClass:            'last'                           # class added to the last tweet

      showAvatar:           false                            # show avatar
      avatarSize:           '48'                             # avatar size in pixels

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

    showTweets = => 
      setState 'loading'

      # fetch the tweets
      $.getJSON(Tweet.apiUrl(@settings), (data) =>
        setState 'formatting'
        tweetCollection = new TweetCollection(data, @settings)
        $(element).append tweetCollection.formattedTweets()
        setState 'loaded'
      )

    ## public methods
    #get current state
    @getState = -> state

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