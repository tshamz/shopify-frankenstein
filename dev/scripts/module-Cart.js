(function(Cart, $, undefined) {

  // Private
  var bindUIActions = function() {
    $('.inline-cart-toggle').on('click', function() {
      renderCart();
    });
    $(document).on('click', '.inline-cart-continue-shopping, .inline-cart-item a', function() {
      Overlay.hideOverlay();
    });
    $(document).on('click', '.add-to-cart-button', function() {
      updateCart('add', parseInt($('.add-to-cart-quantity').val(), 10), $('.product-variant-select-box').val());
    });
    $(document).on('click', '.inline-add-to-cart-button', function() {
      updateCart('add', 1, $(this).attr('data-variant-id'));
    });
    $(document).on('click', '.inline-cart-item-remove i', function() {
      updateCart('change', 0, $(this).closest('.inline-cart-item').attr('data-variant-id'));
    });
  };

  var renderCart = function() {
    $.getJSON('/cart.js', function(response) {
      React.render(
        React.createElement(InlineCartOverlayContainer, {data: response}),
        document.getElementById('inline-cart-overlay')
      );
      $('[data-dynamic-count]').html(response.item_count);
      Overlay.showOverlay('.inline-cart');
    });
  };

  var updateCart = function(action, quantity, id) {
    $.post('/cart/'+ action +'.js', { 'quantity': quantity, 'id': id }, function() {
      renderCart();
    }, 'json')
    .fail(function(jqXHR) {
      Overlay.showOverlay('.alert', {message: 'out of stock.', description: 'no more left.'});
    });
  };

  // React Components
  var InlineCartItem = React.createClass({displayName: "InlineCartItem",
    render: function() {
      return (
        React.createElement("div", {className: "inline-cart-item", "data-variant-id": this.props.item.variant_id}, 
          React.createElement("div", {className: "inline-cart-item-image"}, 
            React.createElement("a", {href: "/products/" + this.props.item.handle, title: this.props.item.title}, 
              React.createElement("img", {src: this.props.item.image, alt: this.props.item.title})
            )
          ), 
          React.createElement("div", {className: "inline-cart-item-information"}, 
            React.createElement("span", {className: "inline-cart-item-price"}, this.props.item.quantity, " x "), 
            React.createElement("a", {href: "/products/" + this.props.item.handle, title: this.props.item.title, className: "inline-cart-item-title"}, this.props.item.title), 
            React.createElement("div", {className: "inline-cart-item-price"}, "$", this.props.item.line_price/100)
          ), 
          React.createElement("div", {className: "inline-cart-item-remove"}, React.createElement("i", {className: "fa fa-trash-o"}))
        )
      );
    }
  });

  var InlineCartItems = React.createClass({displayName: "InlineCartItems",
    render: function() {
      var itemNodes = [];
      this.props.data.items.forEach(function(item, index) {
        itemNodes.push(React.createElement(InlineCartItem, {item: item, key: index}));
      }.bind(this));
      return (
        React.createElement("div", {className: "inline-cart-items"}, itemNodes)
      );
    }
  });

  var InlineCartSubtotal = React.createClass({displayName: "InlineCartSubtotal",
    render: function() {
      return (
        React.createElement("div", {className: "inline-cart-totals"}, 
          React.createElement("div", null, "Subtotal"), 
          React.createElement("div", {className: "inline-cart-subtotal-amount"}, "$", this.props.data.total_price/100)
        )
      );
    }
  });

  var InlineCartOverlayContainer = React.createClass({displayName: "InlineCartOverlayContainer",
    render: function() {
      return (
        React.createElement("div", {className: "inline-cart overlay-container", style: {display: 'none'}}, 
          React.createElement("div", {className: "inline-cart-heading"}, 
            React.createElement("div", {className: "inline-cart-title"}, "Your Cart"), 
            React.createElement("div", {className: "inline-cart-close"}, "+")
          ), 
          React.createElement(InlineCartItems, {data: this.props.data}), 
          React.createElement(InlineCartSubtotal, {data: this.props.data}), 
          React.createElement("div", {className: "inline-cart-actions"}, 
            React.createElement("a", {href: "http://sunstaches.myshopify.com/cart", className: "inline-cart-view-cart"}, "View Your Cart"), 
            React.createElement("button", {className: "inline-cart-continue-shopping", href: "#"}, "Continue Shopping")
          )
        )
      );
    }
  });

  // Public / Init
  Cart.init = function() {
    bindUIActions();
    $.getJSON('/cart.js', function(response) {$('[data-dynamic-count]').html(response.item_count);});
  };

}(window.Cart = window.Cart || {}, jQuery));
