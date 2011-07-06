#
# miniFeed, the Twitter plugin for jQuery
# Instructions: Coming Soon
# By: Matthieu Aussaguel, http://www.mynameismatthieu.com, @matthieu_tweets
# Version: 0.1 alpha 1.0
# Updated: July 6th, 2011
#

jQuery ->
    $.miniFeed = (element, options) ->
        # default plugin settings
        @defaults = {
                username              : 'matthieu_tweets'                # twitter username
                list                  : null                             # list name to get the tweets from
                limit                 : 6                                # number of tweets to be displayed

                template              : '{avatar}{tweet}{date}{time}'    # tweet format
                introText             : null                             # text to prepend tweets
                outroText             : null                             # text to append tweets

                className             : 'mini-feed'                      # class added to the <ul> generated element
                firstClass            : 'first'                          # class added to the first tweet
                lastClass             : 'last'                           # class added to the last tweet

                avatarSize            : '48px'                           # avatar size in pixels

                showFavorites         : true                             # show account favorites
                showReplies           : true                             # show account replies
                showRetweets          : true                             # show account retweets

                showOnlyFavorites     : true                             # show account favorites
                showOnlyReplies       : true                             # show account replies
                showOnlyRetweets      : true                             # show account retweets

                timeFormat            : 'normal'                         # time format 'normal' | 'elapsed'
                timeClass             : null                             # class added to the time wrapper

                dateClass             : null                             # class added to the date wrapper

                onLoad                : ->                               # Function() called when the tweets are being loaded,
                onVisible             : ->                               # Function(feed) called when miniTweet is hidden

                showAnimateProperties : {}                               # animate properties on show, will fadeIn by default
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

        # end init method

        # initialise the plugin
        @init()

    $.fn.miniFeed = (options) ->
        return this.each ->
            if undefined == ($ this).data('miniFeed')
                plugin = new $.miniFeed this, options
                ($ this).data 'miniFeed', plugin