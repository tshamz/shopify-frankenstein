(function(Navigation, $, undefined) {
  'use strict';

  // private
  var parsePath = function(path) {
    var results = {};
    path = path.replace(/(^\/|\/$)/g, '');
    if (path === '') path = 'homepage/';
    if (path.indexOf('/') === -1) path += '/';
    results.template = path.match(/(.*)\/(.*)/)[1];
    results.templateState = path.match(/(.*)\/(.*)/)[2];
    return results;
  };

  $(document).on('stateUpdated.resources', function(event, property) {
    var resourcesState = State.getState('resources');
    var resourceLoadStatus = Object.keys(State.getState('resources')).map(function(key) {
      return resourcesState[key];
    });
    if (resourceLoadStatus.indexOf(null) === -1 && resourceLoadStatus.indexOf('failed') === -1) {
      var initialState = parsePath(window.location.pathname);
      history.replaceState({'template': initialState.template, 'templateState': initialState.templateState}, '', null);
      $(document).trigger('stateChange', ['view', {'template': initialState.template, 'templateState': initialState.templateState}]);
      $(this).off('stateUpdated.resources');
    }
  });

  $(document).on('click', 'a:not([href^="http"])', function() {
    var newState = parsePath($(this).attr('href'));
    history.pushState({'template': newState.template, 'templateState': newState.templateState}, '', $(this).attr('href'));
    $(document).trigger('stateChange', ['view', {'template': newState.template, 'templateState': newState.templateState}]);
    return false;
  });

  window.addEventListener('popstate', function(event) {
    $(document).trigger('stateChange', ['view', {'template': event.state.template, 'templateState': event.state.templateState}]);
  });

  $('.navigation-item a, .navigation-logo a').on('click', function() {
    $('.navigation-item').removeClass('is-active');
    if ($(this).parent().hasClass('navigation-item')) {
      $(this).parent().addClass('is-active');
    }
  });


  // public
  Navigation.init = function() {};

}(window.Navigation = window.Navigation || {}, jQuery));
