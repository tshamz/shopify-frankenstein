(function(Products, $, undefined) {

  var ProductVariant = React.createClass({
    render: function() {
      return (
        <option className="variant-option" data-variant-id={this.props.id} data-in-stock={this.props.inStock} data-price={this.props.price}>{this.props.name}</option>
      );
    }
  });

  var ProductVariants = React.createClass({
    render: function() {
      var variants = [];
      this.props.variants.forEach(function(variant, index) {
        variants.push(<ProductVariant id={variant.id} inStock={variant.available} name={variant.title} price={variant.price} />);
      }.bind(this))
      return (
        <div className="product-variants-select">
          <label className="product-variants-select-label">Color:</label>
          <select>{variants}</select>
        </div>
      );
    }
  });

  var ProductOptions = React.createClass({
    render: function() {
      var variantSelect;
      if (this.props.product.variants.length > 1) {
        variantSelect = <ProductVariants variants={this.props.product.variants} />
      }
      return (
        <div className="product-options">
          <div className="product-price">
            <span className="product-price-label">Price:</span>
            <span itemprop="priceCurrency" content="USD">$</span>
            <span itemprop="price" content={this.props.product.variants[0].price/100}>{this.props.product.variants[0].price/100}</span>
          </div>
          <div className="product-quantity">
            <label className="product-quantity-label">Qty:</label>
            <input className="add-to-cart-quantity" type="number" value="1" />
            <span className="incrementor" data-amount="1">+</span>
            <span className="decrementer" data-amount="-1">-</span>
          </div>
          {variantSelect}
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
    render: function() {
      return (
        <div className={this.props.active ? 'image-thumbnail is-active' : 'image-thumbnail'}>
          <img src={this.props.image.src} />
        </div>
      );
    }
  });

  var ProductImageThumbnails = React.createClass({
    render: function() {
      var thumbnails = [];
      if (this.props.images.length > 1) {
        this.props.images.forEach(function(image, index) {
          if (index === 0) {
            thumbnails.push(<ProductImageThumbnail active={true} image={image} key={index} />)
          } else {
            thumbnails.push(<ProductImageThumbnail active={false} image={image} key={index} />)
          }
        }.bind(this));
      };
      return (
        <div className="image-thumbnails">{thumbnails}</div>
      );
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
          <div className="product-container template-container">
            <div className="product-images">
              <div className="image-main">
                <img src={this.props.product.images[0].src} />
              </div>
              <ProductImageThumbnails images={this.props.product.images} />
              <ProductSocialSharing />
            </div>
            <div className="product-information">
              <h1 className="product-title">{this.props.product.title}</h1>
              <div className="product-description" dangerouslySetInnerHTML={{__html: this.props.product.body_html}} />
              <ProductOptions product={this.props.product} />
              <div className="product-add-to-cart">
                <button className="add-to-cart-button" data-variant-id={this.props.product.variants[0].id}>Add To Cart</button>
              </div>
            </div>
          </div>
          <div className="related-products-container template-container">
            <h3 className="related-products-heading">Can't find the perfect 'stache? Keep looking below!</h3>
            <RelatedProducts products={Resources.buildRelatedProducts(this.props.product, 4)} />
          </div>
        </div>
      );
    }
  });

  Products.renderProduct = function(handle) {
    React.render(
      <ProductPage product={Resources.getProduct(handle)} />,
      document.getElementById('guts')
    );
  };

}(window.Products = window.Products || {}, jQuery));
