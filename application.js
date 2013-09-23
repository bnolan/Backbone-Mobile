(function() {
  var EditVenueView, HomeController, HomeView, ShowVenueView, Venue, VenueCollection, app;
  var __extends = function(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    if (typeof parent.extended === "function") parent.extended(child);
    child.__super__ = parent.prototype;
  };
  app = {
    activePage: function() {
      return $(".ui-page-active");
    },
    reapplyStyles: function(el) {
      el.find('ul[data-role]').listview();
      el.find('div[data-role="fieldcontain"]').fieldcontain();
      el.find('button[data-role="button"]').button();
      el.find('input,textarea').textinput();
      return el.page();
    },
    redirectTo: function(page) {
      return $.mobile.changePage(page);
    },
    goBack: function() {
      return $.historyBack();
    }
  };
  Venue = (function() {
    function Venue() {
      return Backbone.Model.apply(this, arguments);
    }
    return Venue;
  })();
  __extends(Venue, Backbone.Model);
  Venue.prototype.getName = function() {
    return this.get('name');
  };
  Venue.prototype.getAddress = function() {
    return [this.get('address'), this.get('city'), this.get('state')].join(", ");
  };
  Venue.prototype.getImageUrl = function() {
    return this.get('photo_url');
  };
  Venue.prototype.getLatitude = function() {
    return this.get('geolat');
  };
  Venue.prototype.getLongitude = function() {
    return this.get('geolong');
  };
  Venue.prototype.getMapUrl = function(width, height) {
    width || (width = 300);
    height || (height = 220);
    return "http://maps.google.com/maps/api/staticmap?center=" + (this.getLatitude()) + "," + (this.getLongitude()) + "&zoom=14&size=" + width + "x" + height + "&maptype=terrain&markers=color:red|" + (this.getLatitude()) + "," + (this.getLongitude()) + "&sensor=false";
  };
  VenueCollection = (function() {
    function VenueCollection() {
      VenueCollection.__super__.constructor.apply(this, arguments);
      this.refresh($FOURSQUARE_JSON);
      return this;
    }
    return VenueCollection;
  })();
  __extends(VenueCollection, Backbone.Collection);
  VenueCollection.prototype.model = Venue;
  this.Venues = new VenueCollection;
  EditVenueView = (function() {
    function EditVenueView() {
      var _this;
      _this = this;
      this.render = function() { return EditVenueView.prototype.render.apply(_this, arguments); };
      EditVenueView.__super__.constructor.apply(this, arguments);
      this.el = app.activePage();
      this.template = _.template('<form action="#venue-<%= venue.cid %>-update" method="post">\n\n  <div data-role="fieldcontain">\n    <label>Name</label>\n    <input type="text" value="<%= venue.getName() %>" name="name" />\n  </div>\n  \n  <div data-role="fieldcontain">\n    <label>Address</label>\n    <input type="text" value="<%= venue.get(\'address\') %>" name="address" />\n  </div>\n  \n  <div data-role="fieldcontain">\n    <label>City</label>\n    <input type="text" value="<%= venue.get(\'city\') %>" name="city" />\n  </div>\n  \n  <div data-role="fieldcontain">\n    <label>State</label>\n    <input type="text" value="<%= venue.get(\'state\') %>" name="state" />\n  </div>\n  \n  <button type="submit" data-role="button">Save</button>\n</form>');
      this.model.bind('change', this.render);
      this.render();
      return this;
    }
    return EditVenueView;
  })();
  __extends(EditVenueView, Backbone.View);
  EditVenueView.prototype.events = {
    "submit form": "onSubmit"
  };
  EditVenueView.prototype.onSubmit = function(e) {
    this.model.set({
      name: this.$("input[name='name']").val(),
      address: this.$("input[name='address']").val(),
      city: this.$("input[name='city']").val(),
      state: this.$("input[name='state']").val()
    });
    this.model.trigger('change');
    app.goBack();
    e.preventDefault();
    return e.stopPropagation();
  };
  EditVenueView.prototype.render = function() {
    this.el.find('h1').text("Editing " + (this.model.getName()));
    this.el.find('.ui-content').html(this.template({
      venue: this.model
    }));
    app.reapplyStyles(this.el);
    return this.delegateEvents();
  };
  ShowVenueView = (function() {
    function ShowVenueView() {
      var _this;
      _this = this;
      this.render = function() { return ShowVenueView.prototype.render.apply(_this, arguments); };
      ShowVenueView.__super__.constructor.apply(this, arguments);
      this.el = app.activePage();
      this.template = _.template('<div>\n  \n  <p>\n    <img style="width: 100%" src="<%= venue.getMapUrl() %>" />\n  </p>\n  \n  <address>\n    <%= venue.getAddress() %>\n  </address>\n\n  <ul data-role="listview" data-inset="true">\n    <li data-role="list-divider">Actions</li>\n    <li><a rel="external" href="openmap:q=<%= encodeURIComponent(venue.getAddress) %>">Open Map</a></li>\n    <li><a href="#venues-<%= venue.cid %>-edit">Edit</a></li>\n  </ul>\n</div>');
      this.model.bind('change', this.render);
      this.render();
      return this;
    }
    return ShowVenueView;
  })();
  __extends(ShowVenueView, Backbone.View);
  ShowVenueView.prototype.render = function() {
    this.el.find('h1').text(this.model.getName());
    this.el.find('.ui-content').html(this.template({
      venue: this.model
    }));
    return app.reapplyStyles(this.el);
  };
  HomeView = (function() {
    function HomeView() {
      var _this;
      _this = this;
      this.render = function() { return HomeView.prototype.render.apply(_this, arguments); };
      HomeView.__super__.constructor.apply(this, arguments);
      this.el = app.activePage();
      this.template = _.template('<div>\n\n<ul data-role="listview" data-theme="c" data-filter="true">\n  <% venues.each(function(venue){ %>\n    <li><a href="#venues-<%= venue.cid %>"><%= venue.getName() %></a></li>\n  <% }); %>\n</ul>\n\n</div>');
      this.render();
      return this;
    }
    return HomeView;
  })();
  __extends(HomeView, Backbone.View);
  HomeView.prototype.render = function() {
    this.el.find('.ui-content').html(this.template({
      venues: Venues
    }));
    return app.reapplyStyles(this.el);
  };
  HomeController = (function() {
    function HomeController() {
      HomeController.__super__.constructor.apply(this, arguments);
      this._views = {};
      return this;
    }
    return HomeController;
  })();
  __extends(HomeController, Backbone.Controller);
  HomeController.prototype.routes = {
    "venues-:cid-edit": "edit",
    "venues-:cid": "show",
    "home": "home"
  };
  HomeController.prototype.home = function() {
    var _base;
    return (_base = this._views)['home'] || (_base['home'] = new HomeView);
  };
  HomeController.prototype.show = function(cid) {
    var _base, _name;
    return (_base = this._views)[_name = "venues-" + cid] || (_base[_name] = new ShowVenueView({
      model: Venues.getByCid(cid)
    }));
  };
  HomeController.prototype.edit = function(cid) {
    var _base, _name;
    return (_base = this._views)[_name = "venues-" + cid + "-edit"] || (_base[_name] = new EditVenueView({
      model: Venues.getByCid(cid)
    }));
  };
  app.homeController = new HomeController();
  $(document).ready(function() {
    Backbone.history.start();
    return app.homeController.home();
  });
  this.app = app;
}).call(this);
