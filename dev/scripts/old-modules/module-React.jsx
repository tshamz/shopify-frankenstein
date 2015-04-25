(function(NewCart, $) {

    // $(document).on('stateUpdated.cart', function(event, freshCart) {
    //   updateCartToggleCount(freshCart.item_count);
    //   if (cartInitialized) {
    //     Overlay.showOverlay('.inline-cart', freshCart);
    //   } else {
    //     cartInitialized = true;
    //   }
    // });

// var buildInlineCartItem = function(item) {
//   var $itemLink = $('<a />', {'href': '/products/' + item.handle, 'title': item.title});
//   var $itemImage = $itemLink.clone().html($('<img />', {'src': item.image, 'alt': item.title}));
//   var $itemQuantity = $('<span />', {'class': 'inline-cart-item-price', 'text': item.quantity + ' x '});
//   var $itemTitle = $itemLink.text(item.product_title).addClass('inline-cart-item-title');
//   var $itemPrice = $('<div />', {'class': 'inline-cart-item-price', 'text': '$' + item.line_price/100});
//   var $itemRemove = $('<i />', {'class': 'fa fa-trash-o', 'data-variant-id': item.variant_id});
//   return $('<div />', {'class': 'inline-cart-item', 'data-variant-id': item.variant_id})
//     .append($('<div />', {'class': 'inline-cart-item-image'}).append($itemImage))
//     .append($('<div />', {'class': 'inline-cart-item-information'}).append($itemQuantity, [$itemTitle, $itemPrice]))
//     .append($('<div />', {'class': 'inline-cart-item-remove'}).append($itemRemove));
// };

// var buildInlineCartItems = function(freshState) {
//   $('.inline-cart-items').empty();
//   $.each(freshState.items, function(index, item) {
//     buildInlineCartItem(item).appendTo('.inline-cart-items');
//   });
//   $('.inline-cart [data-inline-cart-subtotal]').html('$' + freshState.total_price/100);
// };

  // Public
    // Cart.init = function() {
    //   initializeCartState();
    //   bindUIActions();
    // };



}(window.NewCart = window.NewCart || {}, jQuery ));
