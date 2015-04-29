(function(Social, $, undefined) {

  // Private
  var bindUIActions = function() {
    $(document).on('click', '.social-sharing-icon', function() {
      switch($(this).data('network')) {
        case 'facebook':
          window.open('http://www.facebook.com/sharer/sharer.php?u=' + window.location.href, 'Facebook', "width=600, height=400, scrollbars=no");
          break;
        case 'twitter':
          window.open('http://www.twitter.com/intent/tweet?url=' + encodeURIComponent(window.location.href), 'Tweet', "width=600, height=400, scrollbars=no");
          break;
        case 'pinterest':
          var url = encodeURIComponent(window.location.href);
          var imgURL = encodeURIComponent($('.image-main img').attr('src'));
          var description = $('.product-description').text();
          window.open('http://pinterest.com/pin/create/button/?url=' + url + '&media=' + imgURL + '&description=' + description, 'Pinterest', "width=600, height=400, scrollbars=no");
          break;
      }
    });
  };

  // Public / Init
  Social.init = function() {
    bindUIActions();

    (function(d){
      var f = d.getElementsByTagName('SCRIPT')[0], p = d.createElement('SCRIPT');
      p.type = 'text/javascript';
      p.async = true;
      p.src = '//assets.pinterest.com/js/pinit.js';
      f.parentNode.insertBefore(p, f);
    }(document));
  };

}(window.Social = window.Social || {}, jQuery));

