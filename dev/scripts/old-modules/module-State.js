(function(State, $, undefined) {

// Private
  var state = {
    resources: {
      loadState: null
    },
    view: {
      template: null,
      templateState: null,
      relatedProducts: null
    },
    cart: {}
  };

// Non-UI Event Bindings
  $(document).on('stateChange', function(event, property, freshState) {
    if (typeof freshState === 'object') {
      for (var key in freshState) {
        state[property][key] = freshState[key];
      }
      $(document).trigger('stateUpdated.' + property, [state[property]]);
    }
  });

// Public
  State.getState = function(property) {
    if (state.hasOwnProperty(property)) {
      return state[property];
    } else {
      return state;
    }
  };

}(window.State = window.State || {}, jQuery));
