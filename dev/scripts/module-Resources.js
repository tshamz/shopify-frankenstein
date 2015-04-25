(function(Resources, $, undefined) {

// Private
  var collections = {};
  var products = [];
  var productIdMap = [];
  var productHandleMap = [];

  var initializeProductImages = function(isCached) {
    $.each(products, function(index, product) {
      if (product.images.length === 0) {
        product.images = [{src: 'http://placehold.it/250x250'}];
      }
      $.each(product.images, function(index, image) {
        if (isCached) {
          $('<img />', {src: image.src});  // precache all product images (no on mobile?)
        }
      });
    });
  };

  var getResources = function() {
    var $getCollections = $.get('/collections?view=endpoint', function(response) {
      collections = JSON.parse(response);
      console.log(collections);
    });

    var $getProducts = $.get('/collections/all?view=endpoint', function(response) {
      products = JSON.parse(response).products;
      console.log(products);
    });

    $getProducts.done(function() {
      initializeProductImages(true);
      productIdMap = $.map(products, function(product, index) {
        return product.id;
      });
      productHandleMap = $.map(products, function(product, index) {
        return product.handle;
      });
    });

    $.when($getCollections, $getProducts)
      .done(function() {
        $(document).trigger('stateChange.resources', [{loadState: 'loaded'}]);
      })
      .fail(function(jqXHR) {
        // one of the deferreds was rejected
      });
  };

  Resources.buildCollection = function(collectionHandle) {
    var builtCollection = [];
    $.each(collections[collectionHandle].products, function(index, id) {
      builtCollection.push(products[productIdMap.indexOf(id)]);
    });
    return builtCollection;
  };

  Resources.getProduct = function(handle) {
    return products[productHandleMap.indexOf(handle)];
  };

  Resources.buildRelatedProducts = function(product, total) {
    var relatedProducts = [];
    if (!product.collections.slice(1).length) {
      while (relatedProducts.length < total) {
        relatedProducts.push(products[Math.floor(Math.random() * products.length)]);
      }
    } else {
      while (relatedProducts.length < total) {
        var relatedCollections = product.collections.slice(1);  // make sure collection "all" always first
        var randomCollection = relatedCollections[Math.floor(Math.random() * relatedCollections.length)];
        var collectionProducts = collections[randomCollection].products;
        relatedProducts.push(products[productIdMap.indexOf(collectionProducts[Math.floor(Math.random() * collectionProducts.length)])]);
      }
    }
    return relatedProducts;
  };

  Resources.init = function() {
    getResources();
  };

}(window.Resources = window.Resources || {}, jQuery));
