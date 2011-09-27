(function($){

var UCOI = UCOI || {};

/**
 * Initialize.
 */
UCOI.init = function() {
  var size = Drupal.settings.UCOI.size;   
  this.images = Drupal.settings.UCOI.images; 
  this.effect = Drupal.settings.UCOI.effect;
  this.noimage = Drupal.settings.UCOI.noimage;
  this.attributes = Drupal.settings.UCOI.attributes;
  this.defaultSize = Drupal.settings.UCOI.default_size;
  this.nodeid = Drupal.settings.UCOI.nodeid;
  
  // Selects                                      
  $('.add-to-cart select.form-select').change(function(){
    if (aid = UCOI.getAID(this)){
      UCOI.switchImage(aid, this, size);  
    }
  });
  
  // Radios                                      
  $('.add-to-cart .form-radios input').click(function(){
    if (aid = UCOI.getAID(this)){
      UCOI.switchImage(aid, this, size);  
    }
  });

  var self = this;
  if (Drupal.settings.UCOI.uc_option_image_attributes_colorpicker) {
      $('.add-to-cart .form-radios input').each(function(){
        if (aid = UCOI.getAID(this)){
            if (!self.attributes[aid]) { return; }

            var $label = $(this).next('label');
            if (!$label.length) { return; }
            var oid = $(this).val();
            var color = Drupal.settings.UCOI.images[self.nodeid][aid][oid].color;
            if (color) {
              $(this).css('float', 'left');
              $("<div />", { css: {
                width: "24px",
                height: "24px",
                marginLeft: "12px",
                float: 'left',
                border: "1px solid #888",
                background: color
              } }).prependTo($label);
            }

         if ($(this).is(':checked')) {
		UCOI.switchImage(aid, this, size);
		// $(this).prop('checked', false);
         }
        }
      });
  }
};

/**
 * Switch an option image.
 */
UCOI.switchImage = function(aid, input, size) {
  var nid = this.nodeid;
  var oid = $(input).val(); 
  var image =  $(':not(.uc-option-image-preloaded) > div.uc-option-image-block').children('img.uc-option-image');
  if (image.length == 0) {
//    image = $('.main-product-image img');
  }
          
  // Make sure we have permission to switch this attribute
  if (this.attributes[aid] == 0){
    return;
  }

  try {          
    var images = this.images[nid][aid];

    if ((oid=="" || images[oid].derivative=="") && image) {
	    parentImage = image[0].parentNode;
	    parentImage.removeChild(image[0]);    
    } else if (image[0] && images[oid].derivative) {
      this.switchImageEffect(image, images[oid]);
    } else if (image[0] == null) {
       parentImage = $(':not(.uc-option-image-preloaded) > div.uc-option-image-block');
       if (parentImage.length == 0) {
//           parentImage = $('.main-product-image');
       }
       parentImage[0].innerHTML = "<img src=\""+images[oid].derivative+"\" class=\"uc-option-image\">";
    }
  }
  catch (e) {   
    this.switchImageEffect(image, this.noimage); 
  }
};

/**
 * Switch the imagepath based on the selected effect.
 */
UCOI.switchImageEffect = function(image, imageproperty) {
  $(image).parent('a').attr('href', imageproperty.derivative);

  switch(this.effect){
    case 'fade':
      $(image).fadeOut(200, function(){		      
        $(this).attr('src', imageproperty.derivative).fadeIn(200);
      });
      break;
      
    default:
      $(image).attr('src', imageproperty.derivative); 
  }
};

/**
 * Get attribute AID from an input.
 */
UCOI.getAID = function(input) {
  var name = $(input).attr('name');
  return name.match(/attributes\[([0-9]+)\]/)[1]; 
};

  $(function(){
    UCOI.init();
  });

})(jQuery);
