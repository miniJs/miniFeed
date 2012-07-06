describe 'miniFeed', ->
  options =
    username: 'test'

  beforeEach ->
    loadFixtures 'fragment.html'
    @$element = $('#fixtures')

  it 'should be available on the jQuery object', ->
    expect($.fn.miniFeed).toBeDefined()

  it 'should be chainable', ->
    expect(@$element.miniFeed(options)).toBe(@$element)

  it 'should offer default values', ->
    plugin = new $.miniFeed(@$element[0], options)

    expect(plugin.defaults).toBeDefined()

  it 'should overwrites the settings', ->
    plugin = new $.miniFeed(@$element[0], options)
    expect(plugin.settings.username).toBe(options.username)