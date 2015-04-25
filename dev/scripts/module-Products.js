(function(Products, $, undefined) {

  var ProductVariant = React.createClass({displayName: "ProductVariant",
    render: function() {
      return (
        React.createElement("option", {className: "variant-option", "data-variant-id": this.props.id, "data-in-stock": this.props.inStock, "data-price": this.props.price}, this.props.name)
      );
    }
  });

  var ProductVariants = React.createClass({displayName: "ProductVariants",
    render: function() {
      var variants = [];
      this.props.variants.forEach(function(variant, index) {
        variants.push(React.createElement(ProductVariant, {id: variant.id, inStock: variant.available, name: variant.title, price: variant.price}));
      }.bind(this))
      return (
        React.createElement("div", {className: "product-variants-select"}, 
          React.createElement("label", {className: "product-variants-select-label"}, "Color:"), 
          React.createElement("select", null, variants)
        )
      );
    }
  });

  var ProductOptions = React.createClass({displayName: "ProductOptions",
    render: function() {
      var variantSelect;
      if (this.props.product.variants.length > 1) {
        variantSelect = React.createElement(ProductVariants, {variants: this.props.product.variants})
      }
      return (
        React.createElement("div", {className: "product-options"}, 
          React.createElement("div", {className: "product-price"}, 
            React.createElement("span", {className: "product-price-label"}, "Price:"), 
            React.createElement("span", {itemprop: "priceCurrency", content: "USD"}, "$"), 
            React.createElement("span", {itemprop: "price", content: this.props.product.variants[0].price/100}, this.props.product.variants[0].price/100)
          ), 
          React.createElement("div", {className: "product-quantity"}, 
            React.createElement("label", {className: "product-quantity-label"}, "Qty:"), 
            React.createElement("input", {className: "add-to-cart-quantity", type: "number", value: "1"}), 
            React.createElement("span", {className: "incrementor", "data-amount": "1"}, "+"), 
            React.createElement("span", {className: "decrementer", "data-amount": "-1"}, "-")
          ), 
          variantSelect
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
    render: function() {
      return (
        React.createElement("div", {className: this.props.active ? 'image-thumbnail is-active' : 'image-thumbnail'}, 
          React.createElement("img", {src: this.props.image.src})
        )
      );
    }
  });

  var ProductImageThumbnails = React.createClass({displayName: "ProductImageThumbnails",
    render: function() {
      var thumbnails = [];
      if (this.props.images.length > 1) {
        this.props.images.forEach(function(image, index) {
          if (index === 0) {
            thumbnails.push(React.createElement(ProductImageThumbnail, {active: true, image: image, key: index}))
          } else {
            thumbnails.push(React.createElement(ProductImageThumbnail, {active: false, image: image, key: index}))
          }
        }.bind(this));
      };
      return (
        React.createElement("div", {className: "image-thumbnails"}, thumbnails)
      );
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
          React.createElement("div", {className: "product-container template-container"}, 
            React.createElement("div", {className: "product-images"}, 
              React.createElement("div", {className: "image-main"}, 
                React.createElement("img", {src: this.props.product.images[0].src})
              ), 
              React.createElement(ProductImageThumbnails, {images: this.props.product.images}), 
              React.createElement(ProductSocialSharing, null)
            ), 
            React.createElement("div", {className: "product-information"}, 
              React.createElement("h1", {className: "product-title"}, this.props.product.title), 
              React.createElement("div", {className: "product-description", dangerouslySetInnerHTML: {__html: this.props.product.body_html}}), 
              React.createElement(ProductOptions, {product: this.props.product}), 
              React.createElement("div", {className: "product-add-to-cart"}, 
                React.createElement("button", {className: "add-to-cart-button", "data-variant-id": this.props.product.variants[0].id}, "Add To Cart")
              )
            )
          ), 
          React.createElement("div", {className: "related-products-container template-container"}, 
            React.createElement("h3", {className: "related-products-heading"}, "Can't find the perfect 'stache? Keep looking below!"), 
            React.createElement(RelatedProducts, {products: Resources.buildRelatedProducts(this.props.product, 4)})
          )
        )
      );
    }
  });

  Products.renderProduct = function(handle) {
    React.render(
      React.createElement(ProductPage, {product: Resources.getProduct(handle)}),
      document.getElementById('guts')
    );
  };

}(window.Products = window.Products || {}, jQuery));
