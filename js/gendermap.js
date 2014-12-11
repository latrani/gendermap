(function ($) {
  'use strict';

  var getDiamondCoords = function(event, $element){
    var height = $element.height();
    var offset = $element.offset();
    var elementX = event.pageX - offset.left;
    var elementY = event.pageY - offset.top;
    var radius = height/2;
    var diagonalF = elementX - elementY;
    var diagonalM = elementX + elementY;
    return {
      'inside': (diagonalF > -radius) && (diagonalF < radius) &&
                (diagonalM > radius && diagonalM < (height + radius)),
      'x': elementX,
      'y': elementY,
      'f': 1 - ((radius - diagonalF) / height),
      'm': 1 - ((diagonalM - radius) / height)
    };
  };

  $.fn.gendermap = function() {
    var $mainEl = this;
    var $maparea = $('<div class="gendermap-area"><div class="gendermap-marker">&times;</div></div>')
      .on('mousemove', function(event){
        if (getDiamondCoords(event, $(this)).inside) {
          $(this).css('cursor', 'crosshair');
        }
        else {
          $(this).css('cursor', 'default');
        }
      })
      .on('click', function(event) {
        var coords = getDiamondCoords(event, $(this));
        if (coords.inside) {
          $('.gendermap-marker').show().css({left: coords.x, top: coords.y});
          $mainEl
            .data('gendermap', {
              m: coords.m,
              f: coords.f
            })
            .trigger('mapClick');
        }
      });

    return $mainEl.addClass('gendermap-container').append($maparea);
  };
}(jQuery));
