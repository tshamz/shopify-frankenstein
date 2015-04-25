(function(Collections, $, undefined) {
  'use strict';

  // private
  var collections = [];

  var getCollections = function() {
    $.get('{{ COLLECTIONSURL }}', function(data) {
      data = JSON.parse(data);
      $.each(data.collections, function(index, collection) {
        collection.products = $.map(collection.products, function(value, index) {
          return parseInt(value, 10);
        });
      });
      collections = data.collections;
    }).done(function() {
      $(document).trigger('stateChange', ['resources', {'collections': 'loaded'}]);
    }).fail(function() {
      $(document).trigger('stateChange', ['resources', {'collections': 'failed'}]);
    });
  };

  // public
  Collections.getCollectionByHandle = function(handle) {
    var result;
    $.each(collections, function(index, collection) {
      if (collection.handle === handle) {
        result = collection;
        return false;
      }
    });
    return result;
  };

  Collections.init = function() {
    getCollections();
  };

}(window.Collections = window.collections || {}, jQuery));
