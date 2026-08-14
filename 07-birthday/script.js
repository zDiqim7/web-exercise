$(document).ready(function () {
  var card = $("#card-wrapper");
  var overlay = $("#celebration-overlay");

  // Open overlay on card click
  card.click(function (e) {
    e.stopPropagation(); // prevent immediate close if bubbling
    overlay.addClass("visible");
  });

  // Close overlay on click
  overlay.click(function () {
    $(this).removeClass("visible");
  });
});
