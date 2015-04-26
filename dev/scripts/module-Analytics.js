(function(Analytics, $, undefined) {

  window._learnq = window._learnq || [];

  Analytics.gaPageView = function() {
   // ga('send', 'pageview');
  };

  Analytics.klavyioPageView = function(productHandle) {
    var product = Resources.getProduct(productHandle);
    _learnq.push(['track', 'Viewed Product', {
      Name: product.title,
      ProductID: product.id,
      Categories: product.memberOfCollection
    }]);
  };

  Analytics.init = function() {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    (function () {
      var b = document.createElement('script'); b.type = 'text/javascript'; b.async = true;
      b.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'a.klaviyo.com/media/js/analytics/analytics.js';
      var a = document.getElementsByTagName('script')[0]; a.parentNode.insertBefore(b, a);
    })();
    KlaviyoSubscribe.attachToForms('#email_signup', {
      hide_form_on_success: true
    });
    KlaviyoSubscribe.attachToModalForm('#klaviyo-modal', {
      delay_seconds: 2,
      success: function ($form) {
        $('.klaviyo_inner')
          .find('.klaviyo_close_modal, .email-input, .form-submit').fadeOut('fast', function() {
            $('.klaviyo_modal_coupon_code').fadeIn('fast');
          });
      }
    });
    _learnq.push(['account', 'hiQ7mU']);
    ga('create', 'UA-49478618-6', 'auto');
    ga('send', 'pageview');
  };

}(window.Analytics = window.Analytics || {}, jQuery));
