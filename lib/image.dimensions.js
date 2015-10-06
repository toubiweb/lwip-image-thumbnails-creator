import debug from 'debug';
var log = debug('litc.image.dimensions');

export default {
    updateDimensions: updateDimensions
};

function updateDimensions(width, height, maxWidth, maxHeight) {

    var dimensions = {
        width: width,
        height: height
    };

    if (maxWidth && maxHeight) {
        // max width AND max height
        if (width > maxWidth || height > maxHeight) {
            // find the more appropriated ratio
            if (width / maxWidth > height / maxHeight) {
                // set width to max, and calculate height
                dimensions.width = maxWidth;
                dimensions.height = Math.round(dimensions.width / width * height);
            } else {
                // set height to max, and calculate width
                dimensions.height = maxHeight;
                dimensions.width = Math.round(dimensions.height / height * width);
            }
        }
    } else if (maxWidth && width > maxWidth) {
        // only max width
        dimensions.width = maxWidth;
        dimensions.height = Math.round(dimensions.width / width * height);

    } else if (maxHeight && height > maxHeight) {
        // only max height
        dimensions.height = maxHeight;
        dimensions.width = Math.round(dimensions.height / height * width);
    }

    if (width !== dimensions.width || height !== dimensions.height) {
        dimensions.updated = true;
        debug('Dimensions updated: ', dimensions);
    } else {
        dimensions.updated = false;
    }

    return dimensions;
}