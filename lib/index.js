import fs from 'fs';
import path from 'path';
import Q from 'q';
import lwip from 'lwip';
import mkdirp from 'mkdirp';

import imageDimensions from './image.dimensions';
import lwipUtil from './lwip.util';

import debug from 'debug';
var log = debug('litc.index');

export default {
    createThumbnail: createThumbnail,
    createThumbnails: createThumbnails
};

function createThumbnail(input, thumbnailConfig, options) {

    return Q.Promise(function (resolve, reject, notify) {

        createThumbnails(input, [thumbnailConfig], options).then(function (result) {
            resolve({
                input: result.input,
                thumbnail: result.thumbnails[0]
            });
        }, function (err) {
            log(err);
            reject(err);
        });
    });
}

/**
 * input: file path or buffer
 * options: file path or buffer
 */
function createThumbnails(input, thumbnailsConfig, options) {

    return Q.Promise(function (resolve, reject, notify) {

        if (!thumbnailsConfig || !thumbnailsConfig.length || thumbnailsConfig.length === 0) {
            log('Invalid thumbnails config:', thumbnailsConfig);
            return reject('Invalid thumbnails config.');
        }

        if (!options) {
            options = {};
        }
        if (typeof options.saveToDisk === 'undefined') {
            // default: true
            options.saveToDisk = true;
        }

        // open image buffer
        lwipUtil.openBuffer(input, options.type).then(function (imageAttributes) {

            if (options.saveToDisk && !options.outputbasepath && imageAttributes.inputpath){
                options.outputbasepath = imageAttributes.inputpath;
            }

            if (thumbnailsConfig.length === 1) {
                log('Process one thumbnail: ', thumbnailsConfig[0]);

                // only one thumbnail: reuse the opened lwip image
                var inputImage = imageAttributes.image;

                lwipUtil.createThumbnailFromLwipImage(inputImage, thumbnailsConfig[0], options).then(function (thumbnail) {
                    resolve({
                        input: imageAttributes,
                        thumbnails: [thumbnail]
                    });
                }, function (err) {
                    log(err);
                    reject(err);
                });
            } else {
                log('Process %d thumbnails.', thumbnailsConfig.length);

                // multiple thumbnails: open a new image from buffer for every manipulation
                var promises = thumbnailsConfig.reduce(function (outputPromises, thumbnailConfig) {

                    log('Process one thumbnail: ', thumbnailConfig);

                    var promise = lwipUtil.createThumbnailFromBuffer(input, imageAttributes.type, thumbnailConfig, options);

                    outputPromises.push(promise);
                    return outputPromises;
                }, []);

                // synchronize process
                Q.all(promises).then(function (thumbnails) {
                    resolve({
                        input: imageAttributes,
                        thumbnails: thumbnails
                    });
                }, function (err) {
                    log(err);
                    reject(err);
                });
            }


        }, function (err) {
            log(err);
            reject(err);
        });

    });
}