(function ($) {
  "use strict";

  var rangeslider = function () {
    if ($("#range-two-val").length > 0) {
      var skipSlider = document.getElementById("range-two-val");
      var skipValues = [
        document.getElementById("skip-value-lower"),
        document.getElementById("skip-value-upper")
      ];

      noUiSlider.create(skipSlider, {
        start: [20, 99],
        connect: true,
        behaviour: "drag",
        step: 1,
        range: {
          min: 20,
          max: 120
        },
      });

      skipSlider.noUiSlider.on("update", function (values, handle) {
        skipValues[handle].innerHTML = "$" + values[handle];
      });
    }
  };


  $(function () {

    rangeslider();
    
  });
})(jQuery);
