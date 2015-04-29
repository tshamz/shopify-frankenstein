(function(Contact, $, undefined) {

  // Private
  var bindUIActions = function() {
    $('form.contact-form').submit(function(){
      Overlay.hideOverlay();
      $.post($(this).attr('action'), $(this).serialize(), function() {
        $('form.contact-form')[0].reset();
      });
      return false;
    });
    $(document).on('click', '.contactform-link', function() {
      Overlay.showOverlay('.contact-form');
    });
  };

  // Public / Init
  Contact.init = function() {
    bindUIActions();
  };

}(window.Contact = window.Contact || {}, jQuery));
