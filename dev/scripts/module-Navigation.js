(function(Navigation, $, undefined) {

// Private
  var parsePath = function(path) {
    var parsedPath = {
      template: path.split('/')[1],
      state: path.split('/')[2]
    };
    parsedPath = parsedPath.template === '' ? {template: 'homepage', templateState: ''} : parsedPath;
    return parsedPath;
  };

  var prettyPrint = function(text) {
    var prettyText = text.replace(/-/g, ' ').replace(/\b\w/g, function(letter) {return letter.toUpperCase();});
    return prettyText;
  };

  var updateNavigationCues = function(freshState) {
    var title = freshState.template === 'homepage' ? 'Sunstaches' : prettyPrint(freshState.template)+ ' - ' +prettyPrint(freshState.state);
    $('title').html(title);
    $('.navigation-item').removeClass('is-active').filter('[data-collection-handle="'+ freshState.state +'"]').addClass('is-active');
  };

  // React methods
  var router = function(template, state) {
    switch(template) {
      case 'collections':
        Collections.renderCollections(state, prettyPrint(state));
        break;
      case 'products':
        Products.renderProduct(state);
        break;
      case 'homepage':
        $.get('/index?view=template', function(response) {  // first callback
          $('#guts').html(response);
        })
        .done(function() {  // second callback
          $('.unslider').unslider();
          Collections.renderHomepageCollections();
        });
        break;
      case 'pages':
        $.get('/pages/'+state+'?view=template', function(response) {
          $('#guts').html(response);
        });
    }
  };

  var bindUIActions = function() {
    $('.navigation-hamburger, .navigation-link').on('click', function() {
      if ($('.navigation-hamburger').is(':visible')) {
        $('.site-topbar, .navigation-items').toggleClass('is-active');
      }
    });
  };

// Non-UI Event Bindings
  $(document).on('stateChange.resources', function(event, resourceLoadState) {
    var initialState = parsePath(window.location.pathname);
    updateNavigationCues(initialState);
    router(initialState.template, initialState.state);
  });

  $(window).on('popstate', function() {
    updateNavigationCues(history.state);
    router(history.state.template, history.state.state);
  });

  $(document).on('click', 'a:not([href^="http"])', function() {
    window.scrollTo(0, 0);
    var freshState = parsePath($(this).attr('href'));
    history.pushState(freshState, '', $(this).attr('href'));
    updateNavigationCues(freshState);
    router(freshState.template, freshState.state);
    return false;
  });

// Public
  Navigation.init = function() {
    bindUIActions();
  };

}(window.Navigation = window.Navigation || {}, jQuery));
