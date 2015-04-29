(function(Analytics, $, undefined) {

  window._learnq = window._learnq || [];

  Analytics.gaPageView = function() {
   // ga('send', 'pageview');
  };

  Analytics.klaviyoPageView = function(productHandle) {
    var product = Resources.getProduct(productHandle);
    _learnq.push(['track', 'Viewed Product', {
      Name: product.title,
      ProductID: product.id,
      Categories: product.memberOfCollection
    }]);
  };

  Analytics.init = function() {
    (function(i,s,o,g,r,a,m){  // Google analytics script inject
      i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    (function () {  // Klaviyo analytics script inject
      var b = document.createElement('script'); b.type = 'text/javascript'; b.async = true;
      b.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'a.klaviyo.com/media/js/analytics/analytics.js';
      var a = document.getElementsByTagName('script')[0]; a.parentNode.insertBefore(b, a);
    });

    KlaviyoSubscribe.attachToForms('#email_signup', {  // Init #email_signup form
      hide_form_on_success: true
    });

    KlaviyoSubscribe.attachToModalForm('#klaviyo-modal', {  // Init #klaviyo-modal form
      delay_seconds: 2,
      success: function ($form) {
        $('.klaviyo_inner')
          .find('.klaviyo_close_modal, .email-input, .form-submit').fadeOut('fast', function() {
            $('.klaviyo_modal_coupon_code').fadeIn('fast');
          });
      }
    });

    // _learnq.push(['account', 'hiQ7mU']);  // Push Klaviyo pageview
    // ga('create', 'UA-49478618-6', 'auto');  // Init Google analyics
    // ga('send', 'pageview');  // Send GA pageview
  };

}(window.Analytics = window.Analytics || {}, jQuery));
