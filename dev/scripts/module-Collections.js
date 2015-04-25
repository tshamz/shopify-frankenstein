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
            React.createElement("span", {itemprop: "price", content: this.props.item.variants[0].price}, this.props.item.variants[0].price)
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
