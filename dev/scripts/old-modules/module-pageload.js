(function(PageLoad, $, undefined){
  'use strict';

  // Private
  var setInitialBrowserState = function() {

  };

  var fadeEverythingIn = function() {
    $(document).ready(function(){
      $('body').addClass('is-loaded');
    });
  };

  // Public
  PageLoad.init = function() {

  };

}(window.PageLoad = window.PageLoad || {}, jQuery));
