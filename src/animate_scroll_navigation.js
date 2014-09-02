(function($) {

    // thi is me :)
    var me = false;

    // default options
    var opts = {
        // selector for elements containing sections
        element: '.section',

        // if sections height should be calculated to match screen height
        fullPage: true,

        // disable animation (usefull for older browsers, etc.)
        noAnimation: false,

        // you can pass all animateScroll options, they will become global for all elements
        animateScrollOptions: {}
    };

    // dictionary od anchors
    var elementHashes = [];

    // default padding from top of the screen. usefull with fixed top menu bar.
    var paddingTop = 0;

    // elements library, indexed by anchor
    // TODO: every element has 2 parameters: anchor and animateScroll options
    var elements = {};

    // current element ID
    var currentElement = null;

    // this flag disables onScroll() current element updating
    var isAutoScroll = false;

    // function returning an element
    var showElement = function() {
        // fire up animateScroll and go to selected element

        opts.animateScrollOptions.onScrollStart = function() {
          isAutoScroll = true;
        };

        opts.animateScrollOptions.onScrollEnd = function() {
          isAutoScroll = false;
        };

        if (elementHashes[currentElement]) {
          if (opts.noAnimation) {
            $(document).scrollTop($("#" + elementHashes[currentElement]).offset().top - paddingTop);
          } else {
            $('#' + elementHashes[currentElement]).animatescroll(opts.animateScrollOptions);
          }
        }
    };

    var methods = {
        init : function(options) {
          me = this;
          // checking if padding top is set
          paddingTop = opts.animateScrollOptions.padding ? opts.animateScrollOptions.padding : 0;

          // calculating full screen height of sections
          if (opts.fullPage) {

              methods.updateOffsets();

              $(window).resize(function() {
                  methods.updateOffsets();
              });
          }

          methods.calculateOffsets();

          // adding event on windows scroll, to check which element is currentlu active
          var oldELement = 0;
          $(window).on('scroll', function() {

              // checking each element parameters
              var len = elementHashes.length;
              var windowHeight = $(window).height();
              var currentScroll = $(window).scrollTop() + paddingTop;

              for (var n = 0; n < len; n++) {

                var tmpElement = $('#' + elementHashes[n]);
                var currentElementOffset = tmpElement.offset().top;
                var currentElementHeight = tmpElement.height();
                var elementBottom = currentElementHeight + currentElementOffset;

                // checking if elements header bottom (== site padding) is between elements offset and height
                if (currentScroll > currentElementOffset && currentScroll < elementBottom) {

                  // setting current element ID
                  if (!isAutoScroll) {
                    currentElement = n;
                  }

                  // checking if History API is available in the browser
                  if (oldELement != currentElement) {
                    if (history.pushState) {

                        // pushing state to browser with History API
                        history.pushState(null, null, '#' + elementHashes[currentElement]);

                        $('[data-scroll!=""]').removeClass('activeNavigationElement');
                        $('[data-scroll="' + elementHashes[currentElement] + '"]').addClass('activeNavigationElement');
                    }
                    else {

                        // no History API => old way
                        location.hash = '#' + elementHashes[currentElement];
                    }
                  }

                  oldELement = currentElement;
                }
              }
            });

            // small hack: we need to wait for calculations get finished (sections height/ offset)
            setTimeout(function() {

              // disabling animation, just for this action (only if it's not disable by default)
              var noAnimationPresentState = opts.noAnimation;
              opts.noAnimation = true;

              methods.goTo(window.location.hash.substring(1));

              // restoring default state from options
              opts.noAnimation = noAnimationPresentState;
            }, 200);
        },

        // showing next element
        next : function() {

            if (-1 === currentElement) {
              currentElement = 0;
            }

            // only if next element won't be out of elements array
            if ((currentElement + 1) < elementHashes.length) {
                currentElement += 1;
            }

            showElement();
        },

        // showing previous element
        previous : function() {
            // only if next element won't be out of elements array
            if ((currentElement - 1) >= 0) {
                currentElement -= 1;
            }
            showElement();
        },

        // go to particular element, either with ID or anchor text
        goTo : function(elementId) {

            // in case od number, we go to ID
            if (typeof elementId === 'number') {
                currentElement = elementId;
            }
            // in case of string, we assume anchor
            else if (typeof elementId === 'string') {
                currentElement = elementHashes.indexOf(elementId);
            }

            showElement();
        },

        // Wrapper for go to -> uses animationScroll options for goTo (i.e. noAnimation)
        // but you can override them :)
        // also: extra padding for non-animation can be set in animateScrollOptions = {padding: 120}
        goToAny : function(elementSelector, animateScrollOptions, noAnimation) {

            var noAnimationPresentState = opts.noAnimation;

            var animateScrollOptionsTmp = (animateScrollOptions) ? animateScrollOptions : opts.animateScrollOptions;

            if (noAnimation) {
              opts.noAnimation = true;
            }

            var nonAnimationPadding = paddingTop;
            if (animateScrollOptions.padding) {
              nonAnimationPadding = animateScrollOptions.padding;
            }

            if (opts.noAnimation) {
              $(document).scrollTop($(elementSelector).offset().top - nonAnimationPadding);
            } else {
              $(elementSelector).animatescroll(animateScrollOptionsTmp);
            }

            // restoring default state from options
            opts.noAnimation = noAnimationPresentState;
        },

        onScrollEvent: function() {
            // console.log()
        },

        getCurrent: function() {
          return {
            id: currentElement,
            max: elementHashes.length
          };
        },

        calculateOffsets: function() {
          elementHashes = [];
          elements = {};
          $(me).find(opts.element).each(function(id, element) {

              var anchor = $(element).attr('id');

              // creating dictionary od anchors
              elementHashes.push(anchor);

              // setting current element ID, only for first element
              if (!currentElement) {
                  currentElement = 0;
              }

              // creating elements library, indexed by anchor
              elements[anchor] = {
                  anchor: anchor,
                  height: $(element).height(),
                  offsetTop: $(element).offset().top
              };

              // adding onClick event to all links with particular anchor url
              $('a[href="#' + anchor + '"]').on('click', function(event) {
                  event.preventDefault();
                  methods.goTo(anchor);
              });

          });
        },
        updateOffsets: function() {
          var minHeight = $(window).height() - paddingTop;
          var currentOffset = paddingTop;

          $(me).find(opts.element).each(function(id, element) {

            var currentHeight = parseInt($(element).css('height'));
            if (currentHeight < minHeight) {
              currentHeight = minHeight;
              $(element).css('min-height', minHeight);
            }

            $(element).offset({
              top: currentOffset,
              left: 'auto'
            });

            currentOffset += currentHeight;

          });
        }
    };

    $.fn.animateScrollNavigation = function(methodOrOptions) {

        if (methods[methodOrOptions]) {
            return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
            // Default to "init"

            // extending default options
            opts = $.extend(opts, methodOrOptions);

            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' +  methodOrOptions + ' does not exist on jQuery.animateScrollNavigation');
        }
    };

})(jQuery);
