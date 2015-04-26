(function(Analytics, $, undefined) {

  window._learnq = window._learnq || [];

  Analytics.gaPageView = function() {
   // ga('send', 'pageview');
  };

  Analytics.klavyioPageView = function(productHandle) {
    var product = Resources.getProduct(productHandle);
    _learnq.push(['track', 'Viewed Product', {
      Name: product.title,
      ProductID: product.id,
      Categories: product.memberOfCollection
    }]);
  };

  Analytics.init = function() {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    (function () {
      var b = document.createElement('script'); b.type = 'text/javascript'; b.async = true;
      b.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'a.klaviyo.com/media/js/analytics/analytics.js';
      var a = document.getElementsByTagName('script')[0]; a.parentNode.insertBefore(b, a);
    })();
    KlaviyoSubscribe.attachToForms('#email_signup', {
      hide_form_on_success: true
    });
    KlaviyoSubscribe.attachToModalForm('#klaviyo-modal', {
      delay_seconds: 2,
      success: function ($form) {
        $('.klaviyo_inner')
          .find('.klaviyo_close_modal, .email-input, .form-submit').fadeOut('fast', function() {
            $('.klaviyo_modal_coupon_code').fadeIn('fast');
          });
      }
    });
    _learnq.push(['account', 'hiQ7mU']);
    ga('create', 'UA-49478618-6', 'auto');
    ga('send', 'pageview');
  };

}(window.Analytics = window.Analytics || {}, jQuery));

(function(Cart, $, undefined) {

  // Private
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

  var bindUIActions = function() {
    $('.inline-cart-toggle').on('click', function() {
      renderCart();
    });
    $(document).on('click', '.inline-cart-continue-shopping, .inline-cart-item a', function() {
      Overlay.hideOverlay();
    });
    $(document).on('click', '.add-to-cart-button', function() {
      updateCart('add', parseInt($('.add-to-cart-quantity').val(), 10), $(this).attr('data-variant-id'));
    });
    $(document).on('click', '.inline-add-to-cart-button', function() {
      updateCart('add', 1, $(this).attr('data-variant-id'));
    });
    $(document).on('click', '.inline-cart-item-remove i', function() {
      updateCart('change', 0, $(this).closest('.inline-cart-item').attr('data-variant-id'));
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

  var CollectionGrid = React.createClass({displayName: "CollectionGrid",
    render: function() {
      var gridItems = [];
      this.props.data.forEach(function(item, index) {
        gridItems.push(React.createElement(Collections.CollectionGridItem, {item: item, key: index}));
      }.bind(this));
      return (
        React.createElement("div", {className: "collection-grid-container template-container"}, gridItems)
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

  Contact.init = function() {
    bindUIActions();
  };

}(window.Contact = window.Contact || {}, jQuery));

(function(Navigation, $, undefined) {

// Private
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
  };

  // React methods
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
        });
        break;
      case 'pages':
        $.get('/pages/'+state+'?view=template', function(response) {
          $('#guts').html(response);
        });
    }
  };

  var bindUIActions = function() {
    $('.navigation-hamburger, .navigation-link').on('click', function() {
      if ($('.navigation-hamburger').is(':visible')) {
        $('.site-topbar, .navigation-items').toggleClass('is-active');
      }
    });
  };

// Non-UI Event Bindings
  $(document).on('stateChange.resources', function(event, resourceLoadState) {
    var initialState = parsePath(window.location.pathname);
    updateNavigationCues(initialState);
    router(initialState.template, initialState.state);
  });

  $(window).on('popstate', function() {
    updateNavigationCues(history.state);
    router(history.state.template, history.state.state);
  });

  $(document).on('click', 'a:not([href^="http"])', function() {
    window.scrollTo(0, 0);
    var freshState = parsePath($(this).attr('href'));
    history.pushState(freshState, '', $(this).attr('href'));
    updateNavigationCues(freshState);
    router(freshState.template, freshState.state);
    return false;
  });

// Public
  Navigation.init = function() {
    bindUIActions();
  };

}(window.Navigation = window.Navigation || {}, jQuery));

(function(Overlay, $, undefined) {

// Private
  var seedAlertOverlay = function(data) {
    $('.alert.overlay-container')
      .find('[data-alert-message]').html(data.message).end()
      .find('[data-alert-description]').html(data.description);
  };

  var bindUIActions = function() {
    $(document).on('click', '.overlay, .overlay [class*="-close"]', function(event) {
      if (event.target === this) {
        Overlay.hideOverlay();
      }
    });
  };

// Public
  Overlay.showOverlay = function(overlayContainer, data) {
    if (overlayContainer === '.alert') {
      seedAlertOverlay(data);
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

(function(Resources, $, undefined) {

// Private
  var collections = {};
  var products = [];
  var productIdMap = [];
  var productHandleMap = [];

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
      console.log(collections);
    });

    var $getProducts = $.get('/collections/all?view=endpoint', function(response) {
      products = JSON.parse(response).products;
      console.log(products);
    });

    $getProducts.done(function() {
      initializeProductImages(true);
      productIdMap = $.map(products, function(product, index) {
        return product.id;
      });
      productHandleMap = $.map(products, function(product, index) {
        return product.handle;
      });
    });

    $.when($getCollections, $getProducts)
      .done(function() {
        $(document).trigger('stateChange.resources', [{loadState: 'loaded'}]);
      })
      .fail(function(jqXHR) {
        // one of the deferreds was rejected
      });
  };

  Resources.buildCollection = function(collectionHandle) {
    var builtCollection = [];
    $.each(collections[collectionHandle].products, function(index, id) {
      builtCollection.push(products[productIdMap.indexOf(id)]);
    });
    return builtCollection;
  };

  Resources.getProduct = function(handle) {
    return products[productHandleMap.indexOf(handle)];
  };

  Resources.buildRelatedProducts = function(product, total) {
    var relatedProducts = [];
    if (!product.collections.slice(1).length) {
      while (relatedProducts.length < total) {
        relatedProducts.push(products[Math.floor(Math.random() * products.length)]);
      }
    } else {
      while (relatedProducts.length < total) {
        var relatedCollections = product.collections.slice(1);  // make sure collection "all" always first
        var randomCollection = relatedCollections[Math.floor(Math.random() * relatedCollections.length)];
        var collectionProducts = collections[randomCollection].products;
        relatedProducts.push(products[productIdMap.indexOf(collectionProducts[Math.floor(Math.random() * collectionProducts.length)])]);
      }
    }
    return relatedProducts;
  };

  Resources.init = function() {
    getResources();
  };

}(window.Resources = window.Resources || {}, jQuery));

(function(Social, $, undefined) {

  (function(d){
    var f = d.getElementsByTagName('SCRIPT')[0], p = d.createElement('SCRIPT');
    p.type = 'text/javascript';
    p.async = true;
    p.src = '//assets.pinterest.com/js/pinit.js';
    f.parentNode.insertBefore(p, f);
  }(document));

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
    $(document).on('click', '.instagram-thing-thumbnails a', function() {
      $('.main-image-entry-point').empty().append($(this).clone());;
      return false;
    });
  };

  Social.instagramFeed = function() {
    $('.instagram-thing-thumbnails').instagramLite({
      clientID:"dc653a3c87cd441b97af3b9b279ed565",
      username:"sunstaches",
      list:false,
      videos:false,
      urls:true,
      limit:4,
      success: function() {
        $('.instagram-thing-thumbnails').children().first().clone().appendTo('.main-image-entry-point');
        while ($('.instagram-thing-thumbnails a').length < 4) {
          $('.instagram-thing-thumbnails a').first().clone().prependTo('.instagram-thing-thumbnails');
        }
      }
    });
  };

  Social.init = function() {
    bindUIActions();
  };

}(window.Social = window.Social || {}, jQuery));

(function() {

  Resources.init();
  Navigation.init();
  Overlay.init();
  Cart.init();
  Contact.init();
  Social.init();

})();
