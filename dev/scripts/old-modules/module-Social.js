(function(Social, $, undefined) {

  (function(d){
    var f = d.getElementsByTagName('SCRIPT')[0], p = d.createElement('SCRIPT');
    p.type = 'text/javascript';
    p.async = true;
    p.src = '//assets.pinterest.com/js/pinit.js';
    f.parentNode.insertBefore(p, f);
  }(document));

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
    $(document).on('click', '.instagram-thing-thumbnails a', function() {
      $('.main-image-entry-point').empty().append($(this).clone());;
      return false;
    });
  };

  Social.instagramFeed = function() {
    $('.instagram-thing-thumbnails').instagramLite({
      clientID:"dc653a3c87cd441b97af3b9b279ed565",
      username:"sunstaches",
      list:false,
      videos:false,
      urls:true,
      limit:4,
      success: function() {
        $('.instagram-thing-thumbnails').children().first().clone().appendTo('.main-image-entry-point');
        while ($('.instagram-thing-thumbnails a').length < 4) {
          $('.instagram-thing-thumbnails a').first().clone().prependTo('.instagram-thing-thumbnails');
        }
      }
    });
  };

  Social.init = function() {
    bindUIActions();
  };

}(window.Social = window.Social || {}, jQuery));
