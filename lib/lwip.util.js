import fs from 'fs';
import path from 'path';
import Q from 'q';
import lwip from 'lwip';
import mkdirp from 'mkdirp';
import imageDimensions from './image.dimensions';

import debug from 'debug';

var log = debug('litc.lwip.util');

export default {
    openBuffer: openBuffer,
    readFile: readFile,
    createThumbnailFromLwipImage: createThumbnailFromLwipImage,
    createThumbnailFromBuffer: createThumbnailFromBuffer
};

function getTypeFromFileExtension(filepath) {
    var extension = path.extname(filepath).substring(1);
    return extension;
}

/**
 * Open a file if necessary.
 * @input: if buffer, returns {image, buffer, type}
 * @input: if file path, open it and returns {image, buffer, type, inputpath}
 * @type: if @input is buffer, type of the image (@see lwip documentation)
 */
function openBuffer(input, type) {

    return Q.Promise(function (resolve, reject, notify) {

        // read file if necessary
        readFile(input, type).then(function (imageAttributes) {

            try {
                lwip.open(imageAttributes.buffer, imageAttributes.type, function (err, image) {

                    if (err) {
                        log(err);
                        reject(err);
                    } else {
                        imageAttributes.image = image;
                        resolve(imageAttributes);
                    }

                });
            } catch (err) {
                log('Error', err);
                reject(new Error(err));
            }

        }, function (err) {
            reject(err);
        });

    });
}

function createThumbnailFromBuffer(buffer, type, thumbnailConfig, options) {

    return Q.Promise(function (resolve, reject, notify) {

        openBuffer(buffer, type).then(function (imageAttributes) {
            resolve(createThumbnailFromLwipImage(imageAttributes.image, thumbnailConfig, options));
        }, function (err) {
            log('Error while opening buffer', err);
            reject(err);
        });

    });
}

function createThumbnailFromLwipImage(inputImage, thumbnailConfig, options) {

    return Q.Promise(function (resolve, reject, notify) {

        var maxWidth = thumbnailConfig.maxWidth;
        var maxHeight = thumbnailConfig.maxHeight;

        var dimensions = imageDimensions.updateDimensions(inputImage.width(), inputImage.height(), maxWidth, maxHeight);

        resize(inputImage, dimensions, thumbnailConfig).then(function (thumbnail) {

            if (options.saveToDisk && options.outputbasepath) {
                writeFileWithDimensionsSuffix(thumbnail.image, options.outputbasepath).then(function (outputpath) {
                    thumbnail.outputpath = outputpath;
                    resolve(thumbnail);
                }, function (err) {
                    log(err);
                    reject(err);
                });
            } else {
                resolve(thumbnail);
            }

        }, function (err) {
            log(err);
            reject(err);
        });

    });
}

function resize(inputImage, dimensions, thumbnailConfig) {

    return Q.Promise(function (resolve, reject, notify) {

        var maxWidth = thumbnailConfig.maxWidth;
        var maxHeight = thumbnailConfig.maxHeight;

        if (dimensions.updated) {

            inputImage.resize(dimensions.width, dimensions.height, function (err, thumbnailImage) {

                if (err) {
                    log('Error resizing image:', err);
                    reject(err);
                } else {
                    resolve({
                        image: thumbnailImage,
                        width: dimensions.width,
                        height: dimensions.height,
                        maxWidth: maxWidth,
                        maxHeight: maxHeight
                    });
                }


            });
        } else {
            // do not resize
            resolve({
                image: inputImage,
                width: dimensions.width,
                height: dimensions.height,
                maxWidth: maxWidth,
                maxHeight: maxHeight
            });

        }

    });
}

function addPathSuffixBeforeFileExtension(inputpath, suffix) {

    var extension = path.extname(inputpath);

    var outputpath = inputpath.substring(0, inputpath.length - extension.length) + suffix + extension;

    return outputpath;
}

function writeFileWithDimensionsSuffix(image, basename) {

    return Q.Promise(function (resolve, reject, notify) {

        var dirpath = path.dirname(basename);
        
        mkdirp(dirpath, function (err) {
            if (err) {

            } else {
                var suffix = '-w' + image.width() + '-h' + image.height();

                var outputpath = addPathSuffixBeforeFileExtension(basename, suffix);

                log('Write file "%s".', outputpath);

                image.writeFile(outputpath, function (errWf) {
                    if (errWf) {
                        log(errWf);
                        reject(errWf);
                    } else {
                        resolve(outputpath);
                    }
                });

            }
        });
    });
}

/**
 * Open a file if necessary.
 * @input: if buffer, returns {buffer}
 * @input: if file path, open it and returns {buffer, inputpath, type}
 * @type: if specified in combinaison with buffer input, set the type attribute in the return object
 */
function readFile(input, type) {

    var imageAttributes = {};

    return Q.Promise(function (resolve, reject, notify) {

        if (input instanceof Buffer) {
            // input is a buffer: nothing to do
            imageAttributes.buffer = input;
            if (type) {
                imageAttributes.type = type;
            }
            resolve(imageAttributes);
        } else if (typeof input === 'string') {
            // input is a file path
            fs.readFile(input, function (err, buffer) {

                if (err) {
                    log(err);
                    reject(new Error(err));
                } else {
                    imageAttributes.inputpath = input;
                    imageAttributes.type = getTypeFromFileExtension(input);
                    imageAttributes.buffer = buffer;

                    resolve(imageAttributes);
                }
            });
        } else {
            log('Invalid parameter: ', input);
            reject(new Error('Invalid parameter: should be a string or a buffer.'));
        }
    });
}