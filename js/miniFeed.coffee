#
# miniFeed, the Twitter plugin for jQuery
# Instructions: http://minijs.com/plugins/9/feed
# By: Matthieu Aussaguel, http://www.mynameismatthieu.com, @mattaussaguel
# Version: 1.0
# Updated: June 10, 2012
# More info: http://minijs.com/
#

class Tweet
  # Class variables
  @urlRegex:      -> /((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi
  @userRegex:     -> /[\@]+([A-Za-z0-9-_]+)/gi
  @hashRegex:     -> /\s[\#]+([A-Za-z0-9-_]+)/gi
  @templateKeys:  -> ['avatar', 'tweet', 'time']

  constructor: (@data, @options) ->

  content: ->
    template = @options.template
    template = template.replace "{#{key}}", @[key]() for key in Tweet.templateKeys()
    template

  tweet: ->
    tweet =  ''
    tweet =  "<span class='intro-text'>#{@options.introText}</span>" unless @options.introText is null
    tweet += @originalText() 
    tweet += "<span class='outro-text'>#{@options.outroText}</span>" unless @options.outroText is null

    "<span class='#{@options.tweetClass}'>#{tweet}</span>"
    
  avatar: ->
    "<img src='#{@avatarUrl()}' class='#{@options.avatarClass}' title='#{@options.username}' height='#{@options.avatarSize}' width='#{@options.avatarSize}'/>"

  time: ->
    time = new Time(@data.created_at, @options.timeFormat)
    "<span class='#{@options.timeClass}'>#{time.formatted()}</span>"

  originalText: ->
    originalText = @data.text
    originalText = originalText.replace(Tweet.urlRegex(),"<a class=\"mini-feed-link\" href=\"$1\">$1</a>");
    originalText = originalText.replace(Tweet.userRegex(),"<a class=\"mini-feed-user-link\" href=\"http://www.twitter.com/$1\">@$1</a>");
    originalText.replace(Tweet.hashRegex(), " <a href=\"http://search.twitter.com/search?q=&tag=$1&lang=all\">#$1</a> ")
    
  listItemClass: (index, size) ->
    return @options.firstClass if index is 0
    return @options.lastClass  if index is (size - 1)

  avatarUrl: -> @data.user.profile_image_url

  isReply: -> @data.in_reply_to_status_id?

  # class methods
  @apiUrl: (options) ->
    apiUrl =  "http://api.twitter.com/1/statuses/user_timeline.json?"
    apiUrl += "screen_name=#{options.username}"
    apiUrl += "&count=#{options.limit}"
    apiUrl += "&include_rts=true" unless options.hideRetweets
    apiUrl += "&callback=?"
    apiUrl

class TweetCollection
  constructor: (apiData, @options) ->
    @tweets = []
    @tweets.push(new Tweet(tweet, @options)) for tweet in apiData

  size: -> @tweets.length
  
  formattedTweets: ->
    $ul = $('<ul />', { 'class': @options.listClass })
    for tweet, index in @tweets
      unless @options.hideReplies and tweet.isReply()
        $li = $('<li />', { 'class' : tweet.listItemClass(index, @size()) })
        $li.append tweet.content()
        $li.appendTo $ul 
    $ul

class Time
  constructor: (time, @format) ->
    @time = time.replace(/^([a-z]{3})( [a-z]{3} \d\d?)(.*)( \d{4})$/i, '$1,$2$4$3')
    @date = new Date @time

  formatted: ->
    return @normalFormat() if @format is "normal"
    @relativeFormat()

  normalFormat: ->
    @date.toDateString()

  relativeFormat: ->
    relative_to = new Date()
    delta = parseInt((relative_to.getTime() - @parsedDate()) / 1000);

    if delta < 60
      'less than a minute ago'
    else if delta < (60*60)
      'about ' + @pluralize("minute", parseInt(delta / 60)) + ' ago'
    else if delta < (24*60*60)
      'about ' + @pluralize("hour", parseInt(delta / 3600)) + ' ago'
    else
      'about ' + @pluralize("day", parseInt(delta / 86400)) + ' ago'

  pluralize: (word, n) ->
    plural = "#{n} #{word}"
    plural += "s" if n > 1
    plural

  parsedDate: ->
    Date.parse @time
      
$ ->
  $.miniFeed = (element, options) ->
    # default plugin settings
    @defaults =
      username:             'mattaussaguel'                  # twitter username
      limit:                6                                # number of tweets to be displayed

      template:             '{avatar}{tweet}{time}'          # tweet template format
      introText:            null                             # text to prepend every tweet
      outroText:            null                             # text to append every tweet

      listClass:            'tweet-list'                     # class added to the list
      firstClass:           'first'                          # class added to the first tweet
      lastClass:            'last'                           # class added to the last tweet

      avatarSize:           '48'                             # avatar size in pixels
      avatarClass:          'tweet-avatar'                   # avatar class name

      tweetClass:          'tweet-text'                      # class added the text wrapper
      hideRetweets:         false                            # hide retweets
      hideReplies:          false                            # hide tweet replies

      timeFormat:           'relative'                       # time format 'normal' | 'elapsed'
      timeClass:            'tweet-time'                     # class added to the time wrapper

      onLoad:               ->                               # Function() called when the tweets are loading,
      onLoaded:             ->                               # Function(feed) called when miniTweet is loaded

    ## private variables
    # current state
    state = ''

    ## public variables
    # plugin settings
    @settings = {}

    # jQuery version of DOM element attached to the plugin
    @$element = $ element

    ## private methods
    # set current state
    setState = (_state) -> state = _state      

    ## public methods
    #get current state
    @getState = -> state

    showTweets = => 
      @callSettingFunction 'onLoad'
      setState 'loading'

      # fetch the tweets
      $.getJSON(Tweet.apiUrl(@settings), (data) =>
        setState 'formatting'
        tweetCollection = new TweetCollection(data, @settings)
        @$element.append(tweetCollection.formattedTweets())
        @callSettingFunction 'onLoaded'
        setState 'loaded'
      )

      
    # get particular plugin setting
    @getSetting = (settingKey) -> @settings[settingKey]

    # call one of the plugin setting functions
    @callSettingFunction = (functionName, args...) -> @settings[functionName](@$element)

    # init function
    @init = ->
      @settings = $.extend {}, @defaults, options

      setState 'initialising'

      showTweets()

    # initialise the plugin
    @init()

    this

  $.fn.miniFeed = (options) ->
    return this.each ->
      if  $(this).data('miniFeed') is undefined
        plugin = new $.miniFeed this, options
        $(this).data('miniFeed', plugin)