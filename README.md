# lwip-image-thumbnails-creator
> Create thumbnails from image using max width/height, optionnaly saving it to disk.

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]

- Reads the EXIF orientation tag from jpeg file
- Automatically rotates/flips using [lwip](https://github.com/EyalAr/lwip)
- Fails silently when EXIF data is not present or image is not a jpeg

## Install

```sh
$ npm install lwip-image-thumbnails-creator --save
```

## Usage

```js
var thumbnailsCreator = require('lwip-image-thumbnails-creator');

var options = { outputbasepath: '/output/thumbnail.jpg'};

// single thumbnail
return thumbnailsCreator.createThumbnail('image.jpg', {
    maxWidth: 100,
    maxHeight: 50
}, options).then(function (res) {
    // ok
    console.log(res.thumbnail);
/* output:
    { 
        image: [Object], 
        width: 150, 
        height: 100, 
        maxWidth: 150, 
        maxHeight: 200, 
        outputpath: '/output/thumbnail-w150-h100.jpg' 
    }
*/

}, function (err) {
  // unexpected error
});

// multiple thumbnail
return thumbnailsCreator.createThumbnail('image.jpg', [{
    maxWidth: 100,
    maxHeight: 50
},{
    maxWidth: 200,
    maxHeight: 100
}], options).then(function (res) {
    // ok
    console.log(res.thumbnails);
/* output:
    [ { 
        image: [Object], 
        width: 150, 
        height: 100, 
        maxWidth: 150, 
        maxHeight: 200, 
        outputpath: '/output/thumbnail-w150-h100.jpg' 
      }, ...]
*/
    
}, function (err) {
  // unexpected error
});


// do not save output buffer to disk
var options = { saveToDisk: false};
return thumbnailsCreator.createThumbnail('image.jpg', [{
    maxWidth: 100,
    maxHeight: 50
},{
    maxWidth: 200,
    maxHeight: 100
}], options).then(function (res) {
    // ok
    console.log(res.thumbnails);
/* output:
    [ { 
        image: [Object], 
        width: 150, 
        height: 100, 
        maxWidth: 150, 
        maxHeight: 200
      }, ...]
*/
    
}, function (err) {
  // unexpected error
});


```

## Development

### Logs

Simple log messages are managed using [debugging utility](https://github.com/visionmedia/debug)

To display them, set env variable:

`DEBUG=litc.*`

### Tests

Tests are run by [Mocha](http://mochajs.org/) test framework and [Chai](http://chaijs.com/) assertion library.

Test images are provided by [EXIF Orientation-flag example images](https://github.com/recurser/exif-orientation-examples) under MIT licence.

To run tests + coverage:

    npm test
    
or
    
    gulp

To run tests only

    gulp test

To run tests in watch mode:

    gulp test-auto

To enable logs:

     DEBUG=litc.* gulp test
     

### Generator

Project generated with [Yeoman Node Generator](https://github.com/yeoman/generator-node).

## License

Apache-2.0 © [Nicolas Toublanc]()

[npm-image]: https://badge.fury.io/js/lwip-image-thumbnails-creator.svg
[npm-url]: https://npmjs.org/package/lwip-image-thumbnails-creator
[travis-image]: https://travis-ci.org/toubiweb/lwip-image-thumbnails-creator.svg?branch=master
[travis-url]: https://travis-ci.org/toubiweb/lwip-image-thumbnails-creator
[daviddm-image]: https://david-dm.org/toubiweb/lwip-image-thumbnails-creator.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/toubiweb/lwip-image-thumbnails-creator
[coveralls-image]: https://coveralls.io/repos/toubiweb/lwip-image-thumbnails-creator/badge.svg
[coveralls-url]: https://coveralls.io/r/toubiweb/lwip-image-thumbnails-creator
