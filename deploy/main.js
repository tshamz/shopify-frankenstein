(function(Analytics, $, undefined) {

  window._learnq = window._learnq || [];

  Analytics.gaPageView = function() {
   // ga('send', 'pageview');
  };

  Analytics.klaviyoPageView = function(productHandle) {
    var product = Resources.getProduct(productHandle);
    _learnq.push(['track', 'Viewed Product', {
      Name: product.title,
      ProductID: product.id,
      Categories: product.memberOfCollection
    }]);
  };

  Analytics.init = function() {
    (function(i,s,o,g,r,a,m){  // Google analytics script inject
      i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    (function () {  // Klaviyo analytics script inject
      var b = document.createElement('script'); b.type = 'text/javascript'; b.async = true;
      b.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'a.klaviyo.com/media/js/analytics/analytics.js';
      var a = document.getElementsByTagName('script')[0]; a.parentNode.insertBefore(b, a);
    });

    KlaviyoSubscribe.attachToForms('#email_signup', {  // Init #email_signup form
      hide_form_on_success: true
    });

    KlaviyoSubscribe.attachToModalForm('#klaviyo-modal', {  // Init #klaviyo-modal form
      delay_seconds: 2,
      success: function ($form) {
        $('.klaviyo_inner')
          .find('.klaviyo_close_modal, .email-input, .form-submit').fadeOut('fast', function() {
            $('.klaviyo_modal_coupon_code').fadeIn('fast');
          });
      }
    });

    // _learnq.push(['account', 'hiQ7mU']);  // Push Klaviyo pageview
    // ga('create', 'UA-49478618-6', 'auto');  // Init Google analyics
    // ga('send', 'pageview');  // Send GA pageview
  };

}(window.Analytics = window.Analytics || {}, jQuery));

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

(function(Collections, $, undefined) {

  // React Components
  var CollectionGrid = React.createClass({displayName: "CollectionGrid",
    render: function() {
      var gridItems = [];
      this.props.data.forEach(function(item, index) {
        gridItems.push(React.createElement(Collections.CollectionGridItem, {item: item, key: index}));
      }.bind(this));
      return (
        React.createElement("div", {className: "collection-grid-container"}, 
          gridItems, 
          React.createElement("div", {className: "grid-spacer"})
        )
      );
    }
  });

  var CollectionsContainer = React.createClass({displayName: "CollectionsContainer",
    render: function() {
      return (
        React.createElement("div", {className: "collection-container"}, 
          React.createElement("div", {className: "collection-title-container"}, 
            React.createElement("h1", {className: "collection-grid-title"}, this.props.title)
          ), 
          React.createElement(CollectionGrid, {data: this.props.data})
        )
      );
    }
  });

  Collections.CollectionGridItem = React.createClass({displayName: "CollectionGridItem",
    render: function() {
      return (
        React.createElement("div", {className: "collection-grid-item", itemscope: "", itemtype: "http://schema.org/Product"}, 
          React.createElement("button", {className: "inline-add-to-cart-button fa fa-shopping-cart", "data-variant-id": this.props.item.variants[0].id}, 
            React.createElement("span", {className: "symbol"}, "+")
          ), 
          React.createElement("a", {href: "/products/" + this.props.item.handle}, React.createElement("img", {className: "item-image", src: this.props.item.images[0].src, itemprop: "image"})), 
          React.createElement("div", {className: "item-price", itemscope: "", itemtype: "http://schema.org/Offer", itemprop: "offers"}, 
            React.createElement("span", {itemprop: "priceCurrency", content: "USD"}, "$"), 
            React.createElement("span", {itemprop: "price", content: this.props.item.variants[0].price/100}, this.props.item.variants[0].price/100)
          ), 
          React.createElement("a", {href: "/products/" + this.props.item.handle}, React.createElement("div", {className: "item-title", itemprop: "name"}, this.props.item.title))
        )
      );
    }
  });

  // Public / Init
  Collections.renderCollections = function(handle, title) {
    React.render(
      React.createElement(CollectionsContainer, {title: title, data: Resources.buildCollection(handle)}),
      document.getElementById('guts')
    );
  };

  Collections.renderHomepageCollections = function() {
    React.render(
      React.createElement(CollectionGrid, {data: Resources.buildCollection('best-sellers')}),
      document.getElementById('homepage-collection')
    );
  }

}(window.Collections = window.Collections || {}, jQuery));

(function(Contact, $, undefined) {

  // Private
  var bindUIActions = function() {
    $('form.contact-form').submit(function(){
      Overlay.hideOverlay();
      $.post($(this).attr('action'), $(this).serialize(), function() {
        $('form.contact-form')[0].reset();
      });
      return false;
    });
    $(document).on('click', '.contactform-link', function() {
      Overlay.showOverlay('.contact-form');
    });
  };

  // Public / Init
  Contact.init = function() {
    bindUIActions();
  };

}(window.Contact = window.Contact || {}, jQuery));

(function(Instagram, $, undefined) {

  // React Components
  var InstagramWidgetThumbnail = React.createClass({displayName: "InstagramWidgetThumbnail",
    handleClick: function(event) {
      event.preventDefault();
      this.props.onUpdate(this.props.src, this.props.link);
    },
    render: function() {
      return (
        React.createElement("a", {onClick: this.handleClick, href: this.props.link}, React.createElement("img", {src: this.props.src, alt: "Instagram Image"}))
      )
    }
  })

  var InstagramWidgetThumbnails = React.createClass({displayName: "InstagramWidgetThumbnails",
    render: function() {
      var thumbnails = [];
      this.props.data.forEach(function(item, index) {
        thumbnails.push(React.createElement(InstagramWidgetThumbnail, {onUpdate: this.props.onUpdate, link: item.link, src: item.images.standard_resolution.url}))
      }.bind(this));
      return (
        React.createElement("div", {className: "instagram-thing-thumbnails"}, thumbnails)
      );
    }
  });

  var InstagramWidgetMain = React.createClass({displayName: "InstagramWidgetMain",
    render: function() {
      return (
        React.createElement("div", {className: "main-image-entry-point"}, 
          React.createElement("a", {href: this.props.link, target: "_blank"}, 
            React.createElement("img", {src: this.props.src, alt: "Instagram Image"})
          )
        )
      );
    }
  });

  var InstagramWidget = React.createClass({displayName: "InstagramWidget",
    getInitialState: function() {
      return {
        image: this.props.data[0].images.standard_resolution.url,
        link: this.props.data[0].link
      };
    },
    onUpdate: function(newImage, newLink) {
      this.setState({
        image: newImage,
        link: newLink
      });
    },
    render: function() {
      return (
        React.createElement("div", null, 
          React.createElement("h3", {className: "instagram-thing-heading section-subheading"}, "Instagram @sunstaches"), 
          React.createElement("div", {className: "instagram-thing-main"}, 
            React.createElement("img", {className: "all-gold-everything", src: "{{ 'all-gold-everything.png' | asset_url }}", alt: "gold picture frame"}), 
            React.createElement(InstagramWidgetMain, {link: this.state.link, src: this.state.image})
          ), 
          React.createElement(InstagramWidgetThumbnails, {data: this.props.data, onUpdate: this.onUpdate})
        )
      );
    }
  });

  // Public / Init
  Instagram.renderInstagramWidget = function() {
    React.render(
      React.createElement(InstagramWidget, {data: Resources.retrieveInstagramMedia('image', 4)}),
      document.getElementById('instagram-widget')
    );
  }

}(window.Instagram = window.Instagram || {}, jQuery));


(function(Navigation, $, undefined) {

  // Private
  var bindUIActions = function() {
    $('.navigation-hamburger, .navigation-link').on('click', function() {
      if ($('.navigation-hamburger').is(':visible')) {
        $('.site-topbar, .navigation-items').toggleClass('is-active');
      }
    });

    $(document).on('click', 'a:not([href^="http"]):not(.pure-follow)', function() {
      window.scrollTo(0, 0);
      var freshState = parsePath($(this).attr('href'));
      history.pushState(freshState, '', $(this).attr('href'));
      updateNavigationCues(freshState);
      router(freshState.template, freshState.state);
      return false;
    });
  };

  var parsePath = function(path) {
    var parsedPath = {
      template: path.split('/')[1],
      state: path.split('/')[2]
    };
    parsedPath = parsedPath.template === '' ? {template: 'homepage', templateState: ''} : parsedPath;
    return parsedPath;
  };

  var prettyPrint = function(text) {
    var prettyText = text.replace(/-/g, ' ').replace(/\b\w/g, function(letter) {return letter.toUpperCase();});
    return prettyText;
  };

  var updateNavigationCues = function(freshState) {
    var title = freshState.template === 'homepage' ? 'Sunstaches' : prettyPrint(freshState.template)+ ' - ' +prettyPrint(freshState.state);
    $('title').html(title);
    $('.navigation-item').removeClass('is-active').filter('[data-collection-handle="'+ freshState.state +'"]').addClass('is-active');
    $('body').removeClass().addClass(freshState.template);
  };

  var router = function(template, state) {
    switch(template) {
      case 'collections':
        Collections.renderCollections(state, prettyPrint(state));
        break;
      case 'products':
        Products.renderProduct(state);
        break;
      case 'homepage':
        $.get('/index?view=template', function(response) {  // first callback
          $('#guts').html(response);
        })
        .done(function() {  // second callback
          $('.unslider').unslider();
          Collections.renderHomepageCollections();
          Instagram.renderInstagramWidget();
        });
        break;
      case 'pages':
        $.get('/pages/'+state+'?view=template', function(response) {
          $('#guts').html(response);
        });
    }
  };

  // Non-UI Event Bindings
  $(document).on('stateChange.resources', function(event, resourceLoadState) {
    var initialState = parsePath(window.location.pathname);
    router(initialState.template, initialState.state);
    updateNavigationCues(initialState);
    $('main').removeClass('content-loading');
  });

  $(window).on('popstate', function() {
    updateNavigationCues(history.state);
    router(history.state.template, history.state.state);
  });

  // Public / Init
  Navigation.init = function() {
    bindUIActions();
  };

}(window.Navigation = window.Navigation || {}, jQuery));

(function(Overlay, $, undefined) {

  // Private
  var bindUIActions = function() {
    $('.overlay').on('click', function(event) {
      if (event.target === this) {
        Overlay.hideOverlay();
      }
    });
    $(document).on('click', '.overlay [class*="-close"]', function(event) {
      if (event.target === this) {
        Overlay.hideOverlay();
      }
    });
  };

  // React Components
  var AlertOverlay = React.createClass({displayName: "AlertOverlay",
    render: function() {
      var overlayStyle = {
        display: 'none'
      };
      return (
        React.createElement("div", {className: "alert overlay-container", style: overlayStyle}, 
          React.createElement("h2", {className: "alert-heading"}, 'Well this is embarrassing...'), 
          React.createElement("div", {className: "alert-close"}, "+"), 
          React.createElement("div", {className: "alert-message"}, this.props.data.message), 
          React.createElement("div", {className: "alert-description"}, this.props.data.description)
        )
      );
    }
  });

  var renderAlert = function(data) {
    React.render(
      React.createElement(AlertOverlay, {data: data}),
      document.getElementById('alert-overlay')
    );
  }

  // Public / Init
  Overlay.showOverlay = function(overlayContainer, data) {
    if (overlayContainer === '.alert') {
      renderAlert(data);
    }
    $('html').addClass('no-scroll');
    $('.overlay').find(overlayContainer).show().end().fadeIn('300');
  };

  Overlay.hideOverlay = function() {
    $('html').removeClass('no-scroll');
    $('.overlay, .overlay-container').fadeOut('300');
  };

  Overlay.init = function() {
    bindUIActions();
  };

}(window.Overlay = window.Overlay || {}, jQuery));

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

(function(Resources, $, undefined) {

  // Private
  var collections = {};
  var products = [];
  var productIdMap = [];
  var productHandleMap = [];
  var instagramMedia = [];

  var initializeProductImages = function(isCached) {
    $.each(products, function(index, product) {
      if (product.images.length === 0) {
        product.images = [{src: 'http://placehold.it/250x250'}];
      }
      $.each(product.images, function(index, image) {
        if (isCached) {
          $('<img />', {src: image.src});  // precache all product images (no on mobile?)
        }
      });
    });
  };

  var getResources = function() {
    var $getCollections = $.get('/collections?view=endpoint', function(response) {
      collections = JSON.parse(response);
      // console.log(collections);
    });

    var $getProducts = $.get('/collections/all?view=endpoint', function(response) {
      products = JSON.parse(response).products;
      // console.log(products);
    });

    var $getInstagramMedia = $.get('https://api.instagram.com/v1/users/1179155947/media/recent/?client_id=dc653a3c87cd441b97af3b9b279ed565&count=10&callback=?', function(response) {
      instagramMedia = response.data;
    }, 'jsonp');

    $getProducts.done(function() {
      initializeProductImages(true);
      productIdMap = $.map(products, function(product, index) {
        return product.id;
      });
      productHandleMap = $.map(products, function(product, index) {
        return product.handle;
      });
    });

    $.when($getCollections, $getProducts, $getInstagramMedia)
      .done(function() {
        $(document).trigger('stateChange.resources', [{loadState: 'loaded'}]);
      })
      .fail(function(jqXHR) {
        // one of the deferreds was rejected
      });
  };


  // Public / Init
  Resources.retrieveInstagramMedia = function(type, total) {
    var instagramResults = [];
    var mediaType = type === 'mixed' ? 'image' || 'video' : type;
    $.each(instagramMedia, function(index, item) {
      if (item.type === mediaType) {
        instagramResults.push(item);
      }
      if (instagramResults.length === total) {
        return false;
      }
    });
    return instagramResults;
  };

  Resources.retrieveProduct = function(handle) {
    return products[productHandleMap.indexOf(handle)];
  };

  Resources.buildRelatedProducts = function(product, total) {
    var relatedProducts = [];
    if (!product.collections.slice(1).length) {
      while (relatedProducts.length < total) {
        relatedProducts.push(products[Math.floor(Math.random() * products.length)]);
      }
    } else {
      var selectedCollection;
      var relatedCollections = product.collections.sort(function() {return 0.5 - Math.random();});
      $.each(relatedCollections, function(index, collection) {
        if (relatedCollections === 'all' || relatedCollections.length < total) {
          return;
        } else {
          selectedCollection = collection;
          return false;
        }
      });
      if (typeof(selectedCollection) === 'undefined') {
        selectedCollection = 'all';
      }
      var collectionProducts = collections[selectedCollection].products;
      while (relatedProducts.length < total) {
        var randomIndex = Math.floor(Math.random() * collectionProducts.length);
        var randomProduct = products[productIdMap.indexOf(collectionProducts[randomIndex])];
        var match = true;
        $.each(relatedProducts, function(index, product) {
          if (randomProduct.id === product.id) {
            match = false;
            return false;
          }
        });
        if (match) {
          relatedProducts.push(randomProduct);
        }
      }
    }
    return relatedProducts;
  };

  Resources.buildCollection = function(collectionHandle) {
    var builtCollection = [];
    $.each(collections[collectionHandle].products, function(index, id) {
      builtCollection.push(products[productIdMap.indexOf(id)]);
    });
    return builtCollection;
  };

  Resources.init = function() {
    getResources();
  };

}(window.Resources = window.Resources || {}, jQuery));

(function(Social, $, undefined) {

  // Private
  var bindUIActions = function() {
    $(document).on('click', '.social-sharing-icon', function() {
      switch($(this).data('network')) {
        case 'facebook':
          window.open('http://www.facebook.com/sharer/sharer.php?u=' + window.location.href, 'Facebook', "width=600, height=400, scrollbars=no");
          break;
        case 'twitter':
          window.open('http://www.twitter.com/intent/tweet?url=' + encodeURIComponent(window.location.href), 'Tweet', "width=600, height=400, scrollbars=no");
          break;
        case 'pinterest':
          var url = encodeURIComponent(window.location.href);
          var imgURL = encodeURIComponent($('.image-main img').attr('src'));
          var description = $('.product-description').text();
          window.open('http://pinterest.com/pin/create/button/?url=' + url + '&media=' + imgURL + '&description=' + description, 'Pinterest', "width=600, height=400, scrollbars=no");
          break;
      }
    });
  };

  // Public / Init
  Social.init = function() {
    bindUIActions();

    (function(d){
      var f = d.getElementsByTagName('SCRIPT')[0], p = d.createElement('SCRIPT');
      p.type = 'text/javascript';
      p.async = true;
      p.src = '//assets.pinterest.com/js/pinit.js';
      f.parentNode.insertBefore(p, f);
    }(document));
  };

}(window.Social = window.Social || {}, jQuery));


(function() {

  Resources.init();
  Cart.init();
  Navigation.init();
  // Analytics.init():
  Products.init();
  Contact.init();
  Overlay.init();
  Social.init();

})();
