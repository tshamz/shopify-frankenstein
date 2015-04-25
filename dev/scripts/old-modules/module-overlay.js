(function(Overlay, $, undefined) {
  'use strict';

  // private
  var buildInlineCartItem = function(item) {
    var $itemLink = $('<a />', {href: item.url, title: item.title});
    var $itemImage = $itemLink.clone().html($('<img />', {src: item.image, alt: item.title}));
    var $itemQuantity = $('<span />', {'class': 'item-price', text: item.quantity + ' x '});
    var $itemTitle = $itemLink.text(item.product_title).addClass('item-title');
    var $itemPrice = $('<div />', {'class': 'item-price', text: '$' + item.line_price/100});
    var $itemRemove = $('<i />', {'class': 'fa fa-trash-o', 'data-variant-id': item.variant_id});
    return $('<div />', {'class': 'inline-cart-item', 'data-variant-id': item.variant_id})
      .append($('<div />', {'class': 'cart-item-image'}).append($itemImage))
      .append($('<div />', {'class': 'cart-item-information'}).append($itemQuantity, [$itemTitle, $itemPrice]))
      .append($('<div />', {'class': 'cart-item-remove'}).append($itemRemove));
  };


  var bindUIActions = function() {
    $(document).on('click', '.overlay, [class*="-close"]', function(event) {
      if (event.target === this) {
        Overlay.hideOverlay();
      }
    });
    $('.inline-cart-toggle').on('click', function() {
      Overlay.showInlineCart();
    });
  };

  // public
  Overlay.showOverlay = function(overlayContainer) {
    $(overlayContainer).show();
    $('.overlay').fadeIn('300');
  };

  Overlay.hideOverlay = function() {
    $('.overlay, .overlay-container').fadeOut('300');
  };

  Overlay.showInlineCart = function() {
    var cart = State.getState('cart');
    $('.inline-cart-items').empty();
    $.each(cart.items, function(index, item) {
      buildInlineCartItem(item).appendTo('.inline-cart-items');
    });
    $('.inline-cart-subtotal-amount').html('$' + (cart.total_price/100).toFixed(2));
    $('.inline-cart').show();
    $('.overlay').fadeIn('300');
  };

  Overlay.init = function() {
    bindUIActions();
  };

}(window.Overlay = window.Overlay || {}, jQuery));
