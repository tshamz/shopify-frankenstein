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
        <InlineCartOverlayContainer data={response} />,
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
  var InlineCartItem = React.createClass({
    render: function() {
      return (
        <div className="inline-cart-item" data-variant-id={this.props.item.variant_id}>
          <div className="inline-cart-item-image">
            <a href={"/products/" + this.props.item.handle} title={this.props.item.title}>
              <img src={this.props.item.image} alt={this.props.item.title} />
            </a>
          </div>
          <div className="inline-cart-item-information">
            <span className="inline-cart-item-price">{this.props.item.quantity} x </span>
            <a href={"/products/" + this.props.item.handle} title={this.props.item.title} className="inline-cart-item-title">{this.props.item.title}</a>
            <div className="inline-cart-item-price">${this.props.item.line_price/100}</div>
          </div>
          <div className="inline-cart-item-remove"><i className="fa fa-trash-o"></i></div>
        </div>
      );
    }
  });

  var InlineCartItems = React.createClass({
    render: function() {
      var itemNodes = [];
      this.props.data.items.forEach(function(item, index) {
        itemNodes.push(<InlineCartItem item={item} key={index} />);
      }.bind(this));
      return (
        <div className="inline-cart-items">{itemNodes}</div>
      );
    }
  });

  var InlineCartSubtotal = React.createClass({
    render: function() {
      return (
        <div className="inline-cart-totals">
          <div>Subtotal</div>
          <div className="inline-cart-subtotal-amount">${this.props.data.total_price/100}</div>
        </div>
      );
    }
  });

  var InlineCartOverlayContainer = React.createClass({
    render: function() {
      return (
        <div className="inline-cart overlay-container" style={{display: 'none'}}>
          <div className="inline-cart-heading">
            <div className="inline-cart-title">Your Cart</div>
            <div className="inline-cart-close">+</div>
          </div>
          <InlineCartItems data={this.props.data} />
          <InlineCartSubtotal data={this.props.data} />
          <div className="inline-cart-actions">
            <a href="http://sunstaches.myshopify.com/cart" className="inline-cart-view-cart">View Your Cart</a>
            <button className="inline-cart-continue-shopping" href="#">Continue Shopping</button>
          </div>
        </div>
      );
    }
  });

  // Public / Init
  Cart.init = function() {
    bindUIActions();
    $.getJSON('/cart.js', function(response) {$('[data-dynamic-count]').html(response.item_count);});
  };

}(window.Cart = window.Cart || {}, jQuery));
