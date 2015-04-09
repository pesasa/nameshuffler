Nameshuffler
============

A tool for randomly dividing things, people, whatever in groups. [Demo page](http://pesasa.github.io/nameshuffler)

A jQuery-plugin. Requires jQuery and `jquery.nameshuffler.js`. Nothing else.

Usage
-----
HTML:
```html
<div id="place"></div>
```

Javascript:
```javascript
jQuery('#place').nameshuffler();
```

If you want to shuffle groups automatically while writing names in the list, use autoshuffle:
```javascript
jQuery('#place').nameshuffler({autoshuffle: true});
```

License
-------
MIT