(function(Overlay, $, undefined) {

// Private
  var seedAlertOverlay = function(data) {
    $('.alert.overlay-container')
      .find('[data-alert-message]').html(data.message).end()
      .find('[data-alert-description]').html(data.description);
  };

  var bindUIActions = function() {
    $(document).on('click', '.overlay, .overlay [class*="-close"]', function(event) {
      if (event.target === this) {
        Overlay.hideOverlay();
      }
    });
  };

// Public
  Overlay.showOverlay = function(overlayContainer, data) {
    if (overlayContainer === '.alert') {
      seedAlertOverlay(data);
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
