(function(Collections, $, undefined) {

  Collections.CollectionGridItem = React.createClass({
    render: function() {
      return (
        <div className="collection-grid-item" itemscope="" itemtype="http://schema.org/Product">
          <button className="inline-add-to-cart-button fa fa-shopping-cart" data-variant-id={this.props.item.variants[0].id}>
            <span className="symbol">+</span>
          </button>
          <a href={"/products/" + this.props.item.handle}><img className="item-image" src={this.props.item.images[0].src} itemprop="image" /></a>
          <div className="item-price" itemscope="" itemtype="http://schema.org/Offer" itemprop="offers">
            <span itemprop="priceCurrency" content="USD">$</span>
            <span itemprop="price" content={this.props.item.variants[0].price/100}>{this.props.item.variants[0].price/100}</span>
          </div>
          <a href={"/products/" + this.props.item.handle}><div className="item-title" itemprop="name">{this.props.item.title}</div></a>
        </div>
      );
    }
  });

  var CollectionGrid = React.createClass({
    render: function() {
      var gridItems = [];
      this.props.data.forEach(function(item, index) {
        gridItems.push(<Collections.CollectionGridItem item={item} key={index} />);
      }.bind(this));
      return (
        <div className="collection-grid-container template-container">{gridItems}</div>
      );
    }
  });

  var CollectionsContainer = React.createClass({
    render: function() {
      return (
        <div className="collection-container">
          <div className="collection-title-container">
            <h1 className="collection-grid-title">{this.props.title}</h1>
          </div>
          <CollectionGrid data={this.props.data} />
        </div>
      );
    }
  });

  Collections.renderCollections = function(handle, title) {
    React.render(
      <CollectionsContainer title={title} data={Resources.buildCollection(handle)} />,
      document.getElementById('guts')
    );
  };

  Collections.renderHomepageCollections = function() {
    React.render(
      <CollectionGrid data={Resources.buildCollection('best-sellers')} />,
      document.getElementById('homepage-collection')
    );
  }

}(window.Collections = window.Collections || {}, jQuery));
