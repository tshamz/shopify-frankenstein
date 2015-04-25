(function(Templates, $, undefined) {

// Private
  var templates = {
    products: {
      location: '/products/template.html',
      data: null
    },
    productsItem: {
      location: '/products/item-template.html',
      data: null
    },
    relatedProductsItem: {
      location: '/collections/item-template.html',
      data: null
    },
    collections: {
      location: '/collections/template.html',
      data: null
    },
    collectionsItem: {
      location: '/collections/item-template.html',
      data: null
    },
    homepage: {
      location: '/index.html?view=template',
      data: null
    },
    homepageItem: {
      location: '/collections/item-template.html',
      data: null
    },
    pages: {
      location: '/pages/template.html',
      data: null
    },
    about: {
      location: '/pages/about.html?view=about-template',
      data: null
    },
    faq: {
      location: '/pages/faq.html?view=faq-template',
      data: null
    },
    retailers: {
      location: '/pages/retailers.html?view=retailers-template',
      data: null
    },
    'privacy-policy': {
      location: '/pages/privacy-policy.html?view=privacy-policy-template',
      data: null
    },
    terms: {
      location: '/pages/terms.html?view=terms-template',
      data: null
    }
  };

  var getTemplates = function() {
    var deferreds = [];
    $.each(templates, function(template, templateInfo) {
      var templateRequest = $.get(templateInfo.location, function(response) {
        templateInfo.data = response;
      });
      deferreds.push(templateRequest);
    });
    $.when.apply($, deferreds).done(function() {
      $(document).trigger('stateChange', ['resources', {templates: 'loaded'}]);
    })
    .fail(function(jqHXR) {
      Overlay.showOverlay('.alert', {
        message: 'There was a problem loading some of the site resources. Please refresh and try loading the page again.',
        description: 'Resource Failed to Load: Templates'
      });
      $(document).trigger('stateChange', ['resources', {templates: 'failed'}]);
    });
  };

// Public
  Templates.getTemplate = function(template) {
    if (templates.hasOwnProperty(template)){
      return templates[template].data;
    }
  };

  Templates.init = function() {
    // getTemplates();
  };

}(window.Templates = window.Templates || {}, jQuery));
