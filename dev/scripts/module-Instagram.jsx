(function(Instagram, $, undefined) {

  // React Components
  var InstagramWidgetThumbnail = React.createClass({
    handleClick: function(event) {
      event.preventDefault();
      this.props.onUpdate(this.props.src, this.props.link);
    },
    render: function() {
      return (
        <a onClick={this.handleClick} href={this.props.link}><img src={this.props.src} alt="Instagram Image" /></a>
      )
    }
  })

  var InstagramWidgetThumbnails = React.createClass({
    render: function() {
      var thumbnails = [];
      this.props.data.forEach(function(item, index) {
        thumbnails.push(<InstagramWidgetThumbnail onUpdate={this.props.onUpdate} link={item.link} src={item.images.standard_resolution.url} />)
      }.bind(this));
      return (
        <div className="instagram-thing-thumbnails">{thumbnails}</div>
      );
    }
  });

  var InstagramWidgetMain = React.createClass({
    render: function() {
      return (
        <div className="main-image-entry-point">
          <a href={this.props.link} target="_blank">
            <img src={this.props.src} alt="Instagram Image" />
          </a>
        </div>
      );
    }
  });

  var InstagramWidget = React.createClass({
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
        <div>
          <h3 className="instagram-thing-heading section-subheading">Instagram @sunstaches</h3>
          <div className="instagram-thing-main">
            <img className="all-gold-everything" src="&#123;&#123; 'all-gold-everything.png' | asset_url &#125;&#125;" alt="gold picture frame" />
            <InstagramWidgetMain link={this.state.link} src={this.state.image} />
          </div>
          <InstagramWidgetThumbnails data={this.props.data} onUpdate={this.onUpdate} />
        </div>
      );
    }
  });

  // Public / Init
  Instagram.renderInstagramWidget = function() {
    React.render(
      <InstagramWidget data={Resources.retrieveInstagramMedia('image', 4)} />,
      document.getElementById('instagram-widget')
    );
  }

}(window.Instagram = window.Instagram || {}, jQuery));

