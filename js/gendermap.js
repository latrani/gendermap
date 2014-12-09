$(function(){

  var getDiamondCoords = function(event, $element){
    var height = $element.height();
    var offset = $element.offset();
    var elementX = event.clientX - offset.left;
    var elementY = event.clientY - offset.top;
    var radius = height/2;
    var diagonalF = elementX - elementY;
    var diagonalM = elementX + elementY;
    return {
      "inside": (diagonalF > -radius) && (diagonalF < radius) &&
                (diagonalM > radius && diagonalM < (height + radius)),
      "x": elementX,
      "y": elementY,
      "f": 1 - ((radius - diagonalF) / height),
      "m": 1 - ((diagonalM - radius) / height)
    };
  };

  $(".map-area").on("mousemove", function(event){
    if (getDiamondCoords(event, $(this)).inside) {
      $(this).css("cursor", "crosshair");
    }
    else {
      $(this).css("cursor", "default");
    }
  });

  $(".map-area").on("click", function(event) {
    var coords = getDiamondCoords(event, $(this));
    if (coords.inside) {
      $(".user-value-male").text((Math.floor(coords.m * 21) * 5) + "%");
      $(".user-value-female").text((Math.floor(coords.f * 21) * 5) + "%");
      $("#gender-map-male").val(coords.m);
      $("#gender-map-male-quantized").val(Math.ceil(coords.m * 5));
      $("#gender-map-female").val(coords.f);
      $("#gender-map-female-quantized").val(Math.ceil(coords.f * 5));
      $(".marker").show().css({left: coords.x, top: coords.y});
    }
  });
});