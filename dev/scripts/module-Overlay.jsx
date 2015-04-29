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
  var AlertOverlay = React.createClass({
    render: function() {
      var overlayStyle = {
        display: 'none'
      };
      return (
        <div className="alert overlay-container" style={overlayStyle}>
          <h2 className="alert-heading">{'Well this is embarrassing...'}</h2>
          <div className="alert-close">+</div>
          <div className="alert-message">{this.props.data.message}</div>
          <div className="alert-description">{this.props.data.description}</div>
        </div>
      );
    }
  });

  var renderAlert = function(data) {
    React.render(
      <AlertOverlay data={data} />,
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
