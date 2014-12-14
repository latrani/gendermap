(function ($) {
  'use strict';

  var mapHTML =
  '<div class="gendermap-content">' +
    '<div class="gendermap-container">' +
      '<div class="gendermap-area">' +
        '<div class="gendermap-marker">&times;</div>' +
      '</div>' +
    '</div>' +
    '<div class="gendermap-values">' +
      '<div class="gendermap-value male">' +
        'Male: <span class="gendermap-value-text"></span>' +
      '</div>' +
      '<div class="gendermap-value female">' +
        'Female: <span class="gendermap-value-text"></span>' +
      '</div>' +
    '</div>' +
  '</div>';

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
    var $content = $(mapHTML);
    var clicking = false;

    var setValues = function(coords) {
      $('.gendermap-marker', $mainEl).show().css({left: coords.x, top: coords.y});
      $('.gendermap-value.male .gendermap-value-text', $mainEl).text((Math.floor(coords.m * 21) * 5) + '%');
      $('.gendermap-value.female .gendermap-value-text', $mainEl).text((Math.floor(coords.f * 21) * 5) + '%');
      $mainEl
        .data('gendermap', {
          m: coords.m,
          f: coords.f
        })
        .trigger('mapClick');
    };

    $content.find('.gendermap-area')
      .on('mousemove touchmove', function(event){
        var coords = getDiamondCoords(event, $(this));

        if (coords.inside) {
          $(this).css('cursor', 'crosshair');
          if (clicking) {
            setValues(coords);
          }
        }
        else {
          $(this).css('cursor', 'default');
        }
      })
      .on('mousedown mouseup', function(event) {
        clicking = !clicking;

        // Prevent cursor change to text-select in webkit
        event.originalEvent.preventDefault();

        var coords = getDiamondCoords(event, $(this));
        if (coords.inside) {
          setValues(coords);
        }
      });

    return $mainEl.append($content);
  };
}(jQuery));
