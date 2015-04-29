(function(Resources, $, undefined) {

  // Private
  var collections = {};
  var products = [];
  var productIdMap = [];
  var productHandleMap = [];
  var instagramMedia = [];

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
      // console.log(collections);
    });

    var $getProducts = $.get('/collections/all?view=endpoint', function(response) {
      products = JSON.parse(response).products;
      // console.log(products);
    });

    var $getInstagramMedia = $.get('https://api.instagram.com/v1/users/1179155947/media/recent/?client_id=dc653a3c87cd441b97af3b9b279ed565&count=10&callback=?', function(response) {
      instagramMedia = response.data;
    }, 'jsonp');

    $getProducts.done(function() {
      initializeProductImages(true);
      productIdMap = $.map(products, function(product, index) {
        return product.id;
      });
      productHandleMap = $.map(products, function(product, index) {
        return product.handle;
      });
    });

    $.when($getCollections, $getProducts, $getInstagramMedia)
      .done(function() {
        $(document).trigger('stateChange.resources', [{loadState: 'loaded'}]);
      })
      .fail(function(jqXHR) {
        // one of the deferreds was rejected
      });
  };


  // Public / Init
  Resources.retrieveInstagramMedia = function(type, total) {
    var instagramResults = [];
    var mediaType = type === 'mixed' ? 'image' || 'video' : type;
    $.each(instagramMedia, function(index, item) {
      if (item.type === mediaType) {
        instagramResults.push(item);
      }
      if (instagramResults.length === total) {
        return false;
      }
    });
    return instagramResults;
  };

  Resources.retrieveProduct = function(handle) {
    return products[productHandleMap.indexOf(handle)];
  };

  Resources.buildRelatedProducts = function(product, total) {
    var relatedProducts = [];
    if (!product.collections.slice(1).length) {
      while (relatedProducts.length < total) {
        relatedProducts.push(products[Math.floor(Math.random() * products.length)]);
      }
    } else {
      var selectedCollection;
      var relatedCollections = product.collections.sort(function() {return 0.5 - Math.random();});
      $.each(relatedCollections, function(index, collection) {
        if (relatedCollections === 'all' || relatedCollections.length < total) {
          return;
        } else {
          selectedCollection = collection;
          return false;
        }
      });
      if (typeof(selectedCollection) === 'undefined') {
        selectedCollection = 'all';
      }
      var collectionProducts = collections[selectedCollection].products;
      while (relatedProducts.length < total) {
        var randomIndex = Math.floor(Math.random() * collectionProducts.length);
        var randomProduct = products[productIdMap.indexOf(collectionProducts[randomIndex])];
        var match = true;
        $.each(relatedProducts, function(index, product) {
          if (randomProduct.id === product.id) {
            match = false;
            return false;
          }
        });
        if (match) {
          relatedProducts.push(randomProduct);
        }
      }
    }
    return relatedProducts;
  };

  Resources.buildCollection = function(collectionHandle) {
    var builtCollection = [];
    $.each(collections[collectionHandle].products, function(index, id) {
      builtCollection.push(products[productIdMap.indexOf(id)]);
    });
    return builtCollection;
  };

  Resources.init = function() {
    getResources();
  };

}(window.Resources = window.Resources || {}, jQuery));
