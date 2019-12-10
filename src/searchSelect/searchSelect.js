(function(jQuery, window, document, undefined) {
  function SearchSelect(ele, options) {
    var self = this;
    self.$ele = $(ele);
    self.defaults = {
      data: []
    };

    self.components = {
      $dropdownContainer: $(
        "<div style='display:inline-block;position:relative;'></div>"
      ),
      $dropdown: $(
        "<div style='border:1px solid lightgray;border-radius:3px;display:none'></div>"
      ),
      $searchInput: $(
        "<input type='search' style='width:100%;padding:3px 2px'></input>"
      )
    };
    self.settings = $.extend({}, self.defaults, options);
    self.init();
  }

  SearchSelect.prototype = {
    init: function() {
      this.initStyle();
      this.initEvents();
    },
    initStyle: function() {
      this.$ele.css({
        "border-radius": "5px",
        "font-size": "16px",
        height: "25px",
        padding: "3px 10px",
        outline: "none",
        width: "160px",
        display: "inline-block",
        border: "1px solid lightgray"
      });

      //   jquery中的wrap方法是将参数中的元素包裹到调用wrap方法的元素的外面;
      this.$ele.wrap(this.components.$dropdownContainer);
      this.$ele.after(this.components.$dropdown);
      //   this.components.$dropdown.prepend(this.components.$searchInput);
      this.components.$dropdown.width(this.$ele.innerWidth());

      for (var i = 0; i < this.settings.data.length; i++) {
        this.components.$dropdown.append(
          "<li style='cursor:pointer;padding:2px 10px;text-align:left'>" +
            this.settings.data[i] +
            "</li>"
        );
      }
    },
    initEvents: function() {
      this.$ele.on("focus", $.proxy(this.showPanel, this));
      this.$ele.on("blur", $.proxy(this.hidePanel, this));
      this.$ele.bind(
        "input propertychange change",
        $.proxy(this.filterOptions, this)
      );
      this.$ele
        .parent()
        .find("li")
        .on("click", $.proxy(this.selectItem, this));
    },
    showPanel: function() {
      this.components.$dropdown.show();
    },
    hidePanel: function() {
      this.components.$dropdown.hide();
    },
    filterOptions: function() {
      var searchContent = this.$ele.val();
      var filteredData = [];
      for (var i = 0; i < this.settings.data.length; i++) {
        if (this.settings.data[i].indexOf(searchContent) > -1) {
          filteredData.push(this.settings.data[i]);
        }
        this.components.$dropdown.find("li").remove();
      }
      if (filteredData.length == 0) {
        this.components.$dropdown.append(
          "<li style='cursor:pointer;padding:2px 10px;text-align:left'>没有搜索到对应学校！</li>"
        );
      } else {
        for (var i = 0; i < filteredData.length; i++) {
          this.components.$dropdown.append(
            "<li style='cursor:pointer;padding:2px 10px;text-align:left'>" +
              filteredData[i] +
              "</li>"
          );
        }
      }
    },
    selectItem: function() {
      console.log(this);
      alert("触发!");
      debugger;
    }
  };

  $.fn.SearchSelect = function(options) {
    return this.each(function() {
      new SearchSelect(this, options);
    });
  };
})(jQuery, document, window);

// Author info:wulikunkun
// Date: 2019-12-10-13-33-04
