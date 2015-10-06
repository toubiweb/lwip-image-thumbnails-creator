import imageDimensions from '../lib/image.dimensions';
import path from 'path';

import chai from 'chai';
var expect = chai.expect;

describe('image.dimensions', function () {

    it('Shoud calculate new dimensions from height with width defined!', function () {

        // width, height, maxWidth, maxHeight
        var dimensions = imageDimensions.updateDimensions(200, 300, 100, 100);

        expect(dimensions).to.not.be.undefined;

        expect(dimensions.updated).to.be.true;
        expect(dimensions.width).to.equal(67);
        expect(dimensions.height).to.equal(100);

    });

    it('Shoud calculate new dimensions from height with width null!', function () {

        // width, height, maxWidth, maxHeight
        var dimensions = imageDimensions.updateDimensions(200, 300, null, 100);

        expect(dimensions).to.not.be.undefined;

        expect(dimensions.updated).to.be.true;
        expect(dimensions.width).to.equal(67);
        expect(dimensions.height).to.equal(100);

    });

    it('Shoud calculate new dimensions from width with height defined!', function () {

        // width, height, maxWidth, maxHeight
        var dimensions = imageDimensions.updateDimensions(400, 200, 200, 5000);

        expect(dimensions).to.not.be.undefined;

        expect(dimensions.updated).to.be.true;
        expect(dimensions.width).to.equal(200);
        expect(dimensions.height).to.equal(100);

    });

    it('Shoud calculate new dimensions from width with height undefined!', function () {

        // width, height, maxWidth, maxHeight
        var dimensions = imageDimensions.updateDimensions(400, 200, 200, undefined);

        expect(dimensions).to.not.be.undefined;

        expect(dimensions.updated).to.be.true;
        expect(dimensions.width).to.equal(200);
        expect(dimensions.height).to.equal(100);

    });

    it('Shoud not update dimensions if same size!', function () {

        // width, height, maxWidth, maxHeight
        var dimensions = imageDimensions.updateDimensions(400, 200, 400, 200);

        expect(dimensions).to.not.be.undefined;

        expect(dimensions.updated).to.be.false;
        expect(dimensions.width).to.equal(400);
        expect(dimensions.height).to.equal(200);

    });

    it('Shoud not update dimensions if bigger size!', function () {

        // width, height, maxWidth, maxHeight
        var dimensions = imageDimensions.updateDimensions(400, 200, 4000, 2000);

        expect(dimensions).to.not.be.undefined;

        expect(dimensions.updated).to.be.false;
        expect(dimensions.width).to.equal(400);
        expect(dimensions.height).to.equal(200);

    });

});