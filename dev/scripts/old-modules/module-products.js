(function(Products, $, undefined) {
  'use strict';

  // private
  var products = [];
  var limit = 250;  // max number returned atm

  var buildImages = function(data) {
    var images = [];
    $.each(data.images, function() {
      var image = {
        'id': this.id,
        'position': this.position,
        'src': this.src
      };
      images.push(image);
    });
    return images;
  };

  var buildOptions = function(data) {
    var options = {};
    $.each(data.options, function() {
      options['option' + this.position] = this.name;
    });
    return options;
  };

  var buildVariants = function(data) {
    var variants = [];
    $.each(data.variants, function() {
      var variant = {
        'id': this.id,
        'available': this.available,
        'price': this.price,
        'compareAtPrice': this.compare_at_price,
        'option1': this.option1,
        'option2': this.option2,
        'option3': this.option3,
        'position': this.position,
        'grams': this.grams,
        'shippingRequired': this.requires_shipping,
        'sku': this.sku,
        'taxable': this.taxable,
        'image': null
      };
      if (this.featured_image !== null) variant.image = this.featured_image.src;
      variants.push(variant);
    });
    return variants;
  };

  var normalizeData = function(data) {  // passed an array of product objects from productRequest
    $.each(data.products, function() {
      if (this.handle === 'template') return;
      var product = {
        'handle': this.handle,
        'id': this.id,
        'title': this.title,
        'vendor': this.vendor,
        'type': this.product_type,
        'description': this.body_html,
        'tags': this.tags,
        'options': buildOptions(this),
        'variants': buildVariants(this),
        'images': buildImages(this)
      };
      products.push(product);
    });
  };

  var getProducts = function() {
    var totalProductCount;
    $.getJSON('http://bva-tyler3.myshopify.com/collections.json?limit=' + limit, function(data) {
      $.each(data.collections, function() {
        if (this.handle === 'all') totalProductCount = this.products_count;
      });
    }).done(function() {
      var deferreds = [];
      for (var i = 0; i < totalProductCount / limit; i++) {
        var productRequest = $.getJSON('http://bva-tyler3.myshopify.com/products.json?limit=250&page=' + i, function(data) {
          normalizeData(data);
        });
        deferreds.push(productRequest);
      }
      $.when.apply($, deferreds).done(function() {
        $(document).trigger('stateChange', ['resources', {'products': 'loaded'}]);
      });
    })
    .fail(function() {
      $(document).trigger('stateChange', ['resources', {'products': 'failed'}]);
    });
  };

  // public
  Products.getProduct = function(query) {
    var queryType = typeof(query) === 'string' ? 'handle' : 'id';
    for (var product in products) {
      if (products[product][queryType] === query) {
        return products[product];
      }
    }
  };

  Products.init = function() {
    getProducts();
  };

}(window.Products = window.products || {}, jQuery));
