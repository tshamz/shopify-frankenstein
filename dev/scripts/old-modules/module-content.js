(function(Content, $, undefined) {
  'use strict';

  var imageConstructor = function(images) {
    var imageNodes = [];
    $.each(images, function(index, image) {
      imageNodes.push($('<img />', {src: image.src}));
    });
    return imageNodes;
  };

  var seedContainer = function($container, data, $insertInto) {
    var images = imageConstructor(data.images);
    $container.find('[data-product-link]').attr('href', '/products/' + data.handle);
    $container.find('[data-product-title]').html(data.title);
    $container.find('[data-product-vendor]').html(data.vendor);
    $container.find('[data-product-description]').html(data.description);
    $container.find('[data-product-price]').attr('content', data.variants[0].price).html(data.variants[0].price);
    $container.find('[data-product-image]').attr('src', data.images[0].src);  // figure out solution for no image
    $container.find('[data-main-image]').html(images[0]);
    $container.find('[data-variant-id]').attr('data-variant-id', data.variants[0].id);
    // $container.find('[data-image-thumbnails]');
    $container.find('img').load(function() {
      $container.addClass('is-loaded');
    });
    $insertInto.append($container);
  };

  var updateTemplateState = function(template, templateState) {
    if (template === 'products') {
      var items = [templateState];
      var $insertInto = $('[data-product-container');
    } else if (template === 'collections') {
      var items = Collections.getCollectionByHandle(templateState).products;
      var $insertInto = $('[data-collection-container');
    } else if (template === 'homepage') {
      var items = Collections.getCollectionByHandle('best-sellers').products;
      var $insertInto = $('[data-best-sellers-container');
    } else {
      return false;
    }
    $.each(items, function(index, item) {
      var data = Products.getProduct(item);
      var $container = $(Templates.getTemplate(template + 'Item'));
      seedContainer($container, data, $insertInto);
    });
  }

  $(document).on('stateUpdated.view', function(event, stateProperty) {
    var viewState = State.getState('view');
    $('#guts').html(Templates.getTemplate(viewState.template));
    updateTemplateState(viewState.template, viewState.templateState);
  });

  Content.init = function() {};

}(window.Content = window.Content || {}, jQuery ));
