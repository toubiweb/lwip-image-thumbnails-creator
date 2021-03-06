import thumbnailsCreator from '../lib';
import path from 'path';
import Q from 'q';

import chai from 'chai';
import fs from 'fs';
var expect = chai.expect;
var assert = chai.assert;

import debug from 'debug';
var log = debug('litc.index.test');

describe('lwip-image-thumbnails-creator', function () {

    it('should create a thumbnail from image path!', function () {

        var options = {
            outputbasepath: path.resolve(__dirname, './images/output/thumbnail.jpg')
        };

        // original image - width: 1280px, height: 850px
        var inputpath = path.resolve(__dirname, './images/original-image.jpg');

        return thumbnailsCreator.createThumbnail(inputpath, {
            maxWidth: 128,
            maxHeight: 85
        }, options).then(function (res) {

            log(res);

            expect(res).to.not.be.undefined;

            expect(res.thumbnail).to.not.be.undefined;
            expect(res.thumbnail.image).to.not.be.undefined;

            expect(res.thumbnail.width).to.equal(128);
            expect(res.thumbnail.height).to.equal(85);

            expect(path.basename(res.thumbnail.outputpath)).to.equal('thumbnail-w128-h85.jpg');
        });
    });

    it('should create multiple thumbnails from image path!', function () {

        var options = {
            outputbasepath: path.resolve(__dirname, './images/output/thumbnail.jpg')
        };

        // this test is slower
        this.timeout(5000);

        // original image - width: 1280px, height: 850px
        var inputpath = path.resolve(__dirname, './images/original-image.jpg');

        return thumbnailsCreator.createThumbnails(inputpath, [{
            maxWidth: 150,
            maxHeight: 200
        }, {
            maxWidth: 10
        }, {
            maxHeight: 100
        }], options).then(function (res) {

            log(res);

            expect(res).to.not.be.undefined;

            expect(res.thumbnails).to.not.be.undefined;
            expect(res.thumbnails.length).to.equal(3);

            expect(res.thumbnails[1].width).to.equal(10);
            expect(res.thumbnails[2].height).to.equal(100);
        });
    });

    it('should not save the thumbnail but return lwip image object!', function () {

        // this test is slower
        this.timeout(5000);

        return Q.Promise(function (resolve, reject, notify) {

            var options = {
                saveToDisk: false
            };

            // original image - width: 1280px, height: 850px
            var inputpath = path.resolve(__dirname, './images/original-image.jpg');

            thumbnailsCreator.createThumbnail(inputpath, {
                maxWidth: 600,
                maxHeight: 300
            }, options).then(function (res) {

                log(res);

                expect(res).to.not.be.undefined;

                expect(res.thumbnail).to.not.be.undefined;
                expect(res.thumbnail.image).to.not.be.undefined;

                expect(res.thumbnail.height).to.equal(300);
                expect(res.thumbnail.width).to.equal(452);

                expect(res.thumbnail.outputpath).to.be.undefined;

                expect(res.thumbnail.image).to.not.be.undefined;

                res.thumbnail.image.writeFile(path.resolve(__dirname, './images/output/thumbnail-exact-name-from-lwip-image.jpg'), function (err) {
                    expect(err).to.be.null;

                    resolve('ok');
                });
            });

        });
    });
});