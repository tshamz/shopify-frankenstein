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

