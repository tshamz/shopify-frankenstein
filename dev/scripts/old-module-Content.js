(function(Content, $, undefined) {

// Private
  var getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  var getRelatedProducts = function(amount, collection) {
    var randomProducts = [];
    var productIds = Resources.getCollectionByHandle(collection).products;
    while (randomProducts.length < amount && randomProducts.length < productIds.length) {
      var randomInt = getRandomInt(0, productIds.length);
      if (randomProducts.indexOf(productIds[randomInt]) === -1) {
        randomProducts.push(productIds[randomInt]);
      }
    }
    return randomProducts;
  };

  var imageConstructor = function(images) {
    var imageNodes = [];
    $.each(images, function(index, image) {
      imageNodes.push($('<img />', {src: image.src}));
    });
    return imageNodes;
  };

  var variantConstructor = function(variants) {
    var variantNodes = [];
    $.each(variants, function(index, variant) {
      variantNodes.push($('<option />', {'class': 'variant-option', text: variant.option1, 'data-variant-id': variant.id, 'data-in-stock': variant.available}));
    });
    return variantNodes;
  };

  var initProductImages = function() {
    $('.image-thumbnail').first().addClass('is-active').find('img').clone().appendTo('[data-image-main]');
    if ($('.image-thumbnail').length < 2) {
      $('.image-thumbnails').hide();
    }
  };

  var seedContainer = function($container, data, $insertInto) {
    var images = imageConstructor(data.images);
    $container
      .find('[data-product-link]').attr('href', '/products/' + data.handle).end()
      .find('[data-product-title]').html(data.title).end()
      .find('[data-product-description]').html(data.body_html).end()
      .find('[data-product-price]').attr('content', data.variants[0].price).html(data.variants[0].price).end()
      .find('[data-product-image]').attr('src', data.images[0].src).end()
      .find('[data-variant-id]').attr('data-variant-id', data.variants[0].id);
    if (data.variants.length > 1) {
      $container
        .find('[data-variants-select]').html(variantConstructor(data.variants)).end()
        .find('.product-variants-select').show();
    }
    $.each(images, function(index, image) {
      $container.find('[data-image-thumbnails]').append($('<div />', {'class': 'image-thumbnail'}).html(image));
    });
    $container.appendTo($insertInto);
  };

  var updateTemplateState = function(viewState) {
    var items;
    var $insertInto;
    switch (viewState.template) {
      case 'products':
        items = [viewState.templateState];
        $insertInto = $('[data-product-container]');
        updateTemplateState({template: 'relatedProducts', relatedProducts: viewState.relatedProducts});
        Analytics.klavyioPageView(viewState.templateState);
        break;
      case 'collections':
        items = Resources.getCollectionByHandle(viewState.templateState).products;
        $insertInto = $('[data-collection-container]');
        $('.collection-grid-title').html(viewState.templateState.replace(/-/g, ' ').toUpperCase());
        $('.collection-grid-container').append($('<div />', {'class': 'grid-spacer'}));
        break;
      case 'homepage':
        items = Resources.getCollectionByHandle('best-sellers').products;
        $insertInto = $('[data-best-sellers-container]');
        Social.instagramFeed();
        break;
      case 'pages':
        items = [];
        $insertInto = $('[data-page-container]');
        var subTemplate = Templates.getTemplate(viewState.templateState);
        $insertInto.append(subTemplate);
        break;
      case 'relatedProducts':
        items = getRelatedProducts(4, viewState.relatedProducts);
        $insertInto = $('[data-related-products]');
        break;
      default:
        return false;
    }
    $.each(items, function(index, item) {
      var data = Resources.getProduct(item);
      var $container = $(Templates.getTemplate(viewState.template + 'Item'));
      seedContainer($container, data, $insertInto);
    });
    initProductImages();
    Analytics.gaPageView();
  };

  var bindUIActions = function() {
    $(document).on('change', '.product-variants-select select', function() {
      $('.add-to-cart-button').attr('data-variant-id', $('option:selected', this).attr('data-variant-id'));
    });
    $(document).on('click', '.incrementor, .decrementer', function() {
      var freshAmount =  parseInt($('.add-to-cart-quantity').val()) + $(this).data('amount')
      $('.add-to-cart-quantity').val(freshAmount);
    });
    $(document).on('click', '.product-images .image-thumbnail img', function() {
      $('.product-images')
        .find('.image-main').empty().append($(this).clone()).end()
        .find('.image-thumbnail').removeClass('is-active');
      $(this).parent().addClass('is-active');
    });
    $(document).on('click', '.accordion > dt > a', function() {
      var itemIsVisible = $(this).parent().next().is(':visible') ? true : false;
      $('.accordion > dd').slideUp();
      if (!itemIsVisible) {
        $(this).parent().next().slideDown();
      }
      return false;
    });
  };

// Non-UI Event Bindings
  $(document).on('stateUpdated.view', function(event, freshState) {
    $('#guts').html(Templates.getTemplate(freshState.template));
    updateTemplateState(freshState);
  });

// Public
  Content.init = function() {
    bindUIActions();
  };

}(window.Content = window.Content || {}, jQuery ));
