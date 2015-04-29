(function(Products, $, undefined) {

  // Private
  var bindUIActions = function() {
    $(document).on('click', '.image-thumbnail', function() {
      $('.image-thumbnail').removeClass('is-active').filter(this).addClass('is-active');
    });
  };

  // React Components
  var ProductVariant = React.createClass({
    render: function() {
      return (
        <option className="variant-option" data-in-stock={this.props.inStock} value={this.props.id}>{this.props.name}</option>
      );
    }
  });

  var ProductVariants = React.createClass({
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
        variants.push(<ProductVariant key={index} id={variant.id} inStock={variant.available} name={variant.title} />);
      }.bind(this))
      return (
        <div className={variants.length > 1 ? "product-variants-select" : "product-variants-select hidden"}>
          <label className="product-variants-select-label">Color:</label>
          <select className={this.props.visible === true ? "product-variant-select-box" : "product-variant-select-box hidden" } onChange={this.handleChange} defaultValue={this.props.product.variants[0].id}>{variants}</select>
        </div>
      );
    }
  });

  var ProductOptions = React.createClass({
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
        <div className="product-options">
          <div className="product-price">
            <span className="product-price-label">Price:</span>
            <span itemprop="priceCurrency" content="USD">$</span>
            <span itemprop="price" content={this.props.price/100}>{this.props.price/100}</span>
          </div>
          <div className="product-quantity">
            <label className="product-quantity-label">Qty:</label>
            <input className="add-to-cart-quantity" type="number" defaultValue="1" onChange={this.handleQuantityChange} />
            <span className="incrementor" data-amount="1">+</span>
            <span className="decrementer" data-amount="-1">-</span>
          </div>
          <ProductVariants onUpdate={this.props.onUpdate} product={this.props.product} visible={this.props.product.variants.length > 1 ? true : false} />

        </div>
      );
    }
  });

  var ProductSocialSharing = React.createClass({
    render: function() {
      return (
        <div className="product-social-sharing">
          <div className="social-sharing-prompt">Share This Stache:</div>
          <div className="social-sharing-icon facebook" data-network="facebook">
            <i className="fa fa-facebook" />
          </div>
          <div className="social-sharing-icon twitter" data-network="twitter">
            <i className="fa fa-twitter" />
          </div>
          <div className="social-sharing-icon pinterest" data-network="pinterest">
            <i className="fa fa-pinterest" />
          </div>
        </div>
      );
    }
  });

  var ProductImageThumbnail = React.createClass({
    handleClick: function(event) {
      event.preventDefault();
      this.props.onUpdate(this.props.image.src, this.props.sku, this.props.variantId, this.props.price);
      $('.product-variant-select-box').val(this.props.variantId);
    },
    render: function() {
      return (
        <div onClick={this.handleClick} className={this.props.first ? 'image-thumbnail is-active' : 'image-thumbnail' } data-variant-id={this.props.variantId} >
          <img src={this.props.image.src} />
        </div>
      );
    }
  });

  var ProductImageThumbnails = React.createClass({
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
          thumbnails.push(<ProductImageThumbnail first={index === 0 ? true : false} sku={sku} variantId={variantId} price={price} image={image} key={index} onUpdate={this.props.onUpdate} />)
        }.bind(this));
      };
      return (
        <div className="image-thumbnails">{thumbnails}</div>
      );
    }
  });

  var Product = React.createClass({
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
        <div className="product-container">
          <div className="product-images">
            <div className="image-main">
              <img src={this.state.image} />
            </div>
            <ProductImageThumbnails product={this.props.product} price={this.state.price} onUpdate={this.onUpdate} />
            <ProductSocialSharing />
          </div>
          <div className="product-information">
            <h1 className="product-title">{this.props.product.title}</h1>
            <div className="product-description" dangerouslySetInnerHTML={{__html: decodeURI(this.props.product.body_html)}} />
            <div className="product-sku">SKU: <span>{this.state.sku}</span></div>
            <ProductOptions product={this.props.product} price={this.state.price} onUpdate={this.onUpdate} />
            <div className="product-add-to-cart">
              <button className="add-to-cart-button">Add To Cart</button>
            </div>
          </div>
        </div>
      )
    }
  });

  var RelatedProducts = React.createClass({
    render: function() {
      var gridItems = [];
      this.props.products.forEach(function(item, index) {
        gridItems.push(<Collections.CollectionGridItem item={item} key={index} />);
      }.bind(this));
      return (
        <div className="related-products">{gridItems}</div>
      );
    }
  });

  var ProductPage = React.createClass({
    render: function() {
      return (
        <div>
          <Product product={this.props.product} />
          <div className="related-products-container">
            <h3 className="related-products-heading">Can't find the perfect 'stache? Keep looking below!</h3>
            <RelatedProducts products={Resources.buildRelatedProducts(this.props.product, 4)} />
          </div>
        </div>
      );
    }
  });

  // Public / Init
  Products.renderProduct = function(handle) {
    React.render(
      <ProductPage product={Resources.retrieveProduct(handle)} />,
      document.getElementById('guts')
    );
  };

  Products.init = function() {
    bindUIActions();
  };

}(window.Products = window.Products || {}, jQuery));
