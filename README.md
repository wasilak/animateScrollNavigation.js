AnimateScrollNavigation.js
=============

A Simple jQuery Plugin extending [animateScroll](https://github.com/ramswaroop/animatescroll.js) plugin with Single Page Scroll Capabilities

You can see demo [here](http://wasilak.github.io/animateScrollNavigation.js).

Why bother?
-------------------

I needed jQuery plugin allowing me to nicely navigate around single page website and none I could find had all fetures I needed:

* Smooth, continous scroll across sections
* Ability to navigate to each and every section, also programatically
* Possible menu integration, but I didin't want menu to be included as part of a package
* Each section can have different hight
* If section height is less then screen height - it can be adjusted
* If section is higher then screen - we're cool
* It had to support anchor links to sections, i.e. ```#section1```
* It would support [History API](https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Manipulating_the_browser_history)

This is why I bothered writing this plugin. If its features are what you are looking for - that's perfect! :)

INSTALLATION
-------------------

via bower:

```
bower install animatescroll-navigation
```

or simply download latest source code from repository: [link](https://github.com/wasilak/animateScrollNavigation.js/archive/master.zip)

USAGE
-------------------

First of all - you'll need jQuery, so make sure to include it before plugin itself. Plugin works with both v1.x and 2.x versions. You can use CDN if you'd like.

```html
<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
```

Secondly: This plugin uses animateScroll for handling all transitions, please also include it before animateScrollNavigation.js

```html
<script src="path/to/animatescroll.min.js"></script>
```

Now: animateScrollNavigation.js

```html
<script src="path/to/animate_scroll_navigation.min.js"></script>
```

animateScrollNavigation.js uses simple markup: one container, on which you call this plugin and an number of elements inside of it. You can set them with CSS selector, but it defaults to ```.section```. Every section has to have ```id``` with anchor name, i.e. ```id="section3"``` - this is good, because you can always fallback to regular anchor link behaviour.

Let's say you'd like to have container ```#fullPage``` and standard sections containers ```.section```:

```html
<div id="fullpage">
    <div class="section" id="section1">
        section1
    </div>
    <div class="section" id="section2">
        section2
    </div>
    <div class="section" id="section3">
        section3
    </div>
    <div class="section" id="section4">
        section4
    </div>
</div>
```

After that only thing left to do is init animateScrollNavigation.js with default options by calling:

```js
$(document).ready(function(){
    $('#fullpage').animateScrollNavigation();
});
```

Whole thing would look something like this:

```html
<!DOCTYPE html>
<html>
    <head>
        <title>animateScrollNavigation.js Demo</title>
    </head>
    <body>
        <div id="fullpage">
            <div class="section" id="section1">
                section1
            </div>
            <div class="section" id="section2">
                section2
            </div>
            <div class="section" id="section3">
                section3
            </div>
            <div class="section" id="section4">
                section4
            </div>
        </div>
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
        <script src="../bower_components/animatescroll/animatescroll.min.js"></script>
        <script src="../dist/animate_scroll_navigation.min.js"></script>
        <script>
            $(document).ready(function(){
                $('#fullpage').animateScrollNavigation();
            });
        </script>
    </body>
</html>
```

Options
-------------

animateScrollNavigation.js accepts couple of parameters/startup options:

```js
$('#fullpage').animateScrollNavigation({
        // selector for elements containing sections
        element: '.section',

        // determines if sections height should be calculated to match screen height
        fullPage: true,

        // disable animation (usefull for older browsers, etc.)
        noAnimation: false,

        // you can pass all animateScroll options, they will become global for all elements in navigation
        animateScrollOptions: {}
    });
```

API
--------------

There are few methods allowing to programatically use this navigation. Assuming you are using ```#fullpage``` as a selector, you can do some nce things, like:

Go to ```next``` section with:

```js
$('#fullpage').animateScrollNavigation('next');
```
... or to ```previous``` section:

```js
$('#fullpage').animateScrollNavigation('previous');
```

In order to go to particular section (i.e. ```section2```), you can use this:

```js
$('#fullpage').animateScrollNavigation('goTo', 'section2');
```

... or you can use sections ID. They are numbered from 0 up:

```js
$('#fullpage').animateScrollNavigation('goTo', 1);
```

In order to get current section:

```js
$('#fullpage').animateScrollNavigation('getCurrent');

// you'll get:
//  {
//      id: currentElementId,
//      max: allElementsCount
//  }
```

As this is based on ```animateScroll```, you can go to any element, even not included in Navigation markup by calling ```goToAny()``` with CSS selector as a first parameter. You can also pass any ```animateScroll``` options and optionally turn of any animation (defaults to false):

```js
$('#fullpage').animateScrollNavigation('goToAny', 'your-css-selector', animateScrollOptions, noAnimation);
```


Building / Minifing
----------

You can build minified version yourself, by simply using [Grunt](http://gruntjs.com) in project root.

Contributing
--------------

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
