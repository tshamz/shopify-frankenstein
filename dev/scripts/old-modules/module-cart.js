(function(Cart, $, undefined) {

  var addToCart = function(quantity, id) {
    $.post('/cart/add.js', { 'quantity': quantity, 'id': id }, function() {
      $.getJSON('/cart.js', function(data) {
        $(document).trigger('stateChange', ['cart', data]);
        Overlay.showInlineCart();
      });
    }, 'json')
    .fail(function(jqXHR, textStatus, errorThrown, responseText, responseJSON) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
      console.log(responseText);
      console.log(responseJSON);
    });
  };

  var removeFromCart = function(quantity, id) {
    $.post('/cart/change.js', { 'quantity': quantity, 'id': id }, function(data) {
      $(document).trigger('stateChange', ['cart', data]);
      $('.inline-cart-item[data-variant-id="'+ id +'"]').fadeOut(function() {
        $(this).remove();
        $('.inline-cart-subtotal-amount').html('$' + (data.total_price/100).toFixed(2));
        if (data.items.length === 0) {
          Overlay.hideOverlay();
        }
      });
    }, 'json')
    .fail(function(jqXHR, textStatus, errorThrown, responseText, responseJSON) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
      console.log(responseText);
      console.log(responseJSON);
    });
  };

  $(document).on('click', '.cart-item-remove i', function() {
    var id = parseInt($(this).attr('data-variant-id'), 10);
    removeFromCart(0, id);
    console.log('quantity:%i, id:%i', 0, id);
  });

  $(document).on('click', '.add-to-cart-button', function() {
    var quantity = parseInt($('.add-to-cart-quantity').val(), 10);
    var id = parseInt($(this).attr('data-variant-id'), 10);
    addToCart(quantity, id);
    console.log('quantity:%i, id:%i', quantity, id);
  });

  $(document).ready(function() {
    $.getJSON('/cart.js', function(data) {
      $(document).trigger('stateChange', ['cart', data]);
    });
  });

}(window.Cart = window.Cart || {}, jQuery));
