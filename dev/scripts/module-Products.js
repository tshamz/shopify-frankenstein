(function(Products, $, undefined) {

  // Private
  var bindUIActions = function() {
    $(document).on('click', '.image-thumbnail', function() {
      $('.image-thumbnail').removeClass('is-active').filter(this).addClass('is-active');
    });
  };

  // React Components
  var ProductVariant = React.createClass({displayName: "ProductVariant",
    render: function() {
      return (
        React.createElement("option", {className: "variant-option", "data-in-stock": this.props.inStock, value: this.props.id}, this.props.name)
      );
    }
  });

  var ProductVariants = React.createClass({displayName: "ProductVariants",
    handleChange: function(event) {
      var position;
      var sku;
      var src;
      var price;
      $.each(this.props.product.variants, function(index, variant) {
        if (event.target.value == variant.id) {
          position = variant.position;
          sku = variant.sku;
          price = variant.price;
          return false;
        }
      });
      $.each(this.props.product.images, function(index, image) {
        if (position === image.position) {
          src = image.src;
          return false;
        }
      });
      this.props.onUpdate(src, sku, event.target.value, price);
      $('.image-thumbnail').removeClass('is-active').filter('[data-variant-id="'+ event.target.value +'"]').addClass('is-active');
    },
    render: function() {
      var variants = [];
      this.props.product.variants.forEach(function(variant, index) {
        variants.push(React.createElement(ProductVariant, {key: index, id: variant.id, inStock: variant.available, name: variant.title}));
      }.bind(this))
      return (
        React.createElement("div", {className: variants.length > 1 ? "product-variants-select" : "product-variants-select hidden"}, 
          React.createElement("label", {className: "product-variants-select-label"}, "Color:"), 
          React.createElement("select", {className: this.props.visible === true ? "product-variant-select-box" : "product-variant-select-box hidden", onChange: this.handleChange, defaultValue: this.props.product.variants[0].id}, variants)
        )
      );
    }
  });

  var ProductOptions = React.createClass({displayName: "ProductOptions",
    handleQuantityChange: function(event) {
      if (event.target.value < 1) {
        $('.add-to-cart-quantity').val(1);
      };
    },
    componentDidMount: function() {
      $('.incrementor, .decrementer').on('click', function() {
        var newQuantity = parseInt($('.add-to-cart-quantity').val(), 10) + $(this).data('amount');
        if (newQuantity < 1) {
          $('.add-to-cart-quantity').val(1);
        } else {
          $('.add-to-cart-quantity').val(newQuantity);
        }
      });
    },
    render: function() {
      return (
        React.createElement("div", {className: "product-options"}, 
          React.createElement("div", {className: "product-price"}, 
            React.createElement("span", {className: "product-price-label"}, "Price:"), 
            React.createElement("span", {itemprop: "priceCurrency", content: "USD"}, "$"), 
            React.createElement("span", {itemprop: "price", content: this.props.price/100}, this.props.price/100)
          ), 
          React.createElement("div", {className: "product-quantity"}, 
            React.createElement("label", {className: "product-quantity-label"}, "Qty:"), 
            React.createElement("input", {className: "add-to-cart-quantity", type: "number", defaultValue: "1", onChange: this.handleQuantityChange}), 
            React.createElement("span", {className: "incrementor", "data-amount": "1"}, "+"), 
            React.createElement("span", {className: "decrementer", "data-amount": "-1"}, "-")
          ), 
          React.createElement(ProductVariants, {onUpdate: this.props.onUpdate, product: this.props.product, visible: this.props.product.variants.length > 1 ? true : false})

        )
      );
    }
  });

  var ProductSocialSharing = React.createClass({displayName: "ProductSocialSharing",
    render: function() {
      return (
        React.createElement("div", {className: "product-social-sharing"}, 
          React.createElement("div", {className: "social-sharing-prompt"}, "Share This Stache:"), 
          React.createElement("div", {className: "social-sharing-icon facebook", "data-network": "facebook"}, 
            React.createElement("i", {className: "fa fa-facebook"})
          ), 
          React.createElement("div", {className: "social-sharing-icon twitter", "data-network": "twitter"}, 
            React.createElement("i", {className: "fa fa-twitter"})
          ), 
          React.createElement("div", {className: "social-sharing-icon pinterest", "data-network": "pinterest"}, 
            React.createElement("i", {className: "fa fa-pinterest"})
          )
        )
      );
    }
  });

  var ProductImageThumbnail = React.createClass({displayName: "ProductImageThumbnail",
    handleClick: function(event) {
      event.preventDefault();
      this.props.onUpdate(this.props.image.src, this.props.sku, this.props.variantId, this.props.price);
      $('.product-variant-select-box').val(this.props.variantId);
    },
    render: function() {
      return (
        React.createElement("div", {onClick: this.handleClick, className: this.props.first ? 'image-thumbnail is-active' : 'image-thumbnail', "data-variant-id": this.props.variantId}, 
          React.createElement("img", {src: this.props.image.src})
        )
      );
    }
  });

  var ProductImageThumbnails = React.createClass({displayName: "ProductImageThumbnails",
    render: function() {
      var thumbnails = [];
      if (this.props.product.images.length > 1) {
        this.props.product.images.forEach(function(image, index) {
          var variantId;
          var sku;
          var price;
          $.each(this.props.product.variants, function(index, variant) {
            if (image.position == variant.position) {
              variantId = variant.id;
              sku = variant.sku;
              price = variant.price;
              return false;
            }
          });
          thumbnails.push(React.createElement(ProductImageThumbnail, {first: index === 0 ? true : false, sku: sku, variantId: variantId, price: price, image: image, key: index, onUpdate: this.props.onUpdate}))
        }.bind(this));
      };
      return (
        React.createElement("div", {className: "image-thumbnails"}, thumbnails)
      );
    }
  });

  var Product = React.createClass({displayName: "Product",
    getInitialState: function() {  // lol
      return {
        image: null,
        sku: null,
        variantId: null,
        price: null
      };
    },
    componentWillMount: function() {  // if you keep trying to mash it in
      this.setState({
        image: this.props.product.images[0].src,
        sku: this.props.product.variants[0].sku,
        variantId: this.props.product.variants[0].id,
        price: parseInt(this.props.product.variants[0].price, 10)
      });
    },
    componentWillReceiveProps: function(nextProps) {  // eventually it's gotta fit...
      this.setState({
        image: nextProps.product.images[0].src,
        sku: nextProps.product.variants[0].sku,
        variantId: nextProps.product.variants[0].id,
        price: parseInt(nextProps.product.variants[0].price, 10)
      });
    },
    onUpdate: function(newImage, newSku, newVariantId, newPrice) {  // right?
      this.setState({
        image: newImage,
        sku: newSku,
        variantId: newVariantId,
        price: parseInt(newPrice, 10)
      });
    },
    render: function() {
      return (
        React.createElement("div", {className: "product-container"}, 
          React.createElement("div", {className: "product-images"}, 
            React.createElement("div", {className: "image-main"}, 
              React.createElement("img", {src: this.state.image})
            ), 
            React.createElement(ProductImageThumbnails, {product: this.props.product, price: this.state.price, onUpdate: this.onUpdate}), 
            React.createElement(ProductSocialSharing, null)
          ), 
          React.createElement("div", {className: "product-information"}, 
            React.createElement("h1", {className: "product-title"}, this.props.product.title), 
            React.createElement("div", {className: "product-description", dangerouslySetInnerHTML: {__html: decodeURI(this.props.product.body_html)}}), 
            React.createElement("div", {className: "product-sku"}, "SKU: ", React.createElement("span", null, this.state.sku)), 
            React.createElement(ProductOptions, {product: this.props.product, price: this.state.price, onUpdate: this.onUpdate}), 
            React.createElement("div", {className: "product-add-to-cart"}, 
              React.createElement("button", {className: "add-to-cart-button"}, "Add To Cart")
            )
          )
        )
      )
    }
  });

  var RelatedProducts = React.createClass({displayName: "RelatedProducts",
    render: function() {
      var gridItems = [];
      this.props.products.forEach(function(item, index) {
        gridItems.push(React.createElement(Collections.CollectionGridItem, {item: item, key: index}));
      }.bind(this));
      return (
        React.createElement("div", {className: "related-products"}, gridItems)
      );
    }
  });

  var ProductPage = React.createClass({displayName: "ProductPage",
    render: function() {
      return (
        React.createElement("div", null, 
          React.createElement(Product, {product: this.props.product}), 
          React.createElement("div", {className: "related-products-container"}, 
            React.createElement("h3", {className: "related-products-heading"}, "Can't find the perfect 'stache? Keep looking below!"), 
            React.createElement(RelatedProducts, {products: Resources.buildRelatedProducts(this.props.product, 4)})
          )
        )
      );
    }
  });

  // Public / Init
  Products.renderProduct = function(handle) {
    React.render(
      React.createElement(ProductPage, {product: Resources.retrieveProduct(handle)}),
      document.getElementById('guts')
    );
  };

  Products.init = function() {
    bindUIActions();
  };

}(window.Products = window.Products || {}, jQuery));
