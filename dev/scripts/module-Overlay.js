(function(Overlay, $, undefined) {

  // Private
  var bindUIActions = function() {
    $('.overlay').on('click', function(event) {
      if (event.target === this) {
        Overlay.hideOverlay();
      }
    });
    $(document).on('click', '.overlay [class*="-close"]', function(event) {
      if (event.target === this) {
        Overlay.hideOverlay();
      }
    });
  };

  // React Components
  var AlertOverlay = React.createClass({displayName: "AlertOverlay",
    render: function() {
      var overlayStyle = {
        display: 'none'
      };
      return (
        React.createElement("div", {className: "alert overlay-container", style: overlayStyle}, 
          React.createElement("h2", {className: "alert-heading"}, 'Well this is embarrassing...'), 
          React.createElement("div", {className: "alert-close"}, "+"), 
          React.createElement("div", {className: "alert-message"}, this.props.data.message), 
          React.createElement("div", {className: "alert-description"}, this.props.data.description)
        )
      );
    }
  });

  var renderAlert = function(data) {
    React.render(
      React.createElement(AlertOverlay, {data: data}),
      document.getElementById('alert-overlay')
    );
  }

  // Public / Init
  Overlay.showOverlay = function(overlayContainer, data) {
    if (overlayContainer === '.alert') {
      renderAlert(data);
    }
    $('html').addClass('no-scroll');
    $('.overlay').find(overlayContainer).show().end().fadeIn('300');
  };

  Overlay.hideOverlay = function() {
    $('html').removeClass('no-scroll');
    $('.overlay, .overlay-container').fadeOut('300');
  };

  Overlay.init = function() {
    bindUIActions();
  };

}(window.Overlay = window.Overlay || {}, jQuery));
