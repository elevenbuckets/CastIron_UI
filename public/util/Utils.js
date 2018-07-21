'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var createCanvasWithAddress = function createCanvasWithAddress(canvas, address) {
    // The random number is a js implementation of the Xorshift PRNG
    var randseed = new Array(4); // Xorshift: [x, y, z, w] 32 bit values

    var seedrand = function seedrand(seed) {
        for (var i = 0; i < randseed.length; i++) {
            randseed[i] = 0;
        }
        for (var i = 0; i < seed.length; i++) {
            randseed[i % 4] = (randseed[i % 4] << 5) - randseed[i % 4] + seed.charCodeAt(i);
        }
    };

    var rand = function rand() {
        // based on Java's String.hashCode(), expanded to 4 32bit values
        var t = randseed[0] ^ randseed[0] << 11;

        randseed[0] = randseed[1];
        randseed[1] = randseed[2];
        randseed[2] = randseed[3];
        randseed[3] = randseed[3] ^ randseed[3] >> 19 ^ t ^ t >> 8;

        return (randseed[3] >>> 0) / (1 << 31 >>> 0);
    };

    var createColor = function createColor() {
        //saturation is the whole color spectrum
        var h = Math.floor(rand() * 360);
        //saturation goes from 40 to 100, it avoids greyish colors
        var s = rand() * 60 + 40 + '%';
        //lightness can be anything from 0 to 100, but probabilities are a bell curve around 50%
        var l = (rand() + rand() + rand() + rand()) * 25 + '%';

        var color = 'hsl(' + h + ',' + s + ',' + l + ')';
        return color;
    };

    var createImageData = function createImageData(size) {
        var width = size; // Only support square icons for now
        var height = size;

        var dataWidth = Math.ceil(width / 2);
        var mirrorWidth = width - dataWidth;

        var data = [];
        for (var y = 0; y < height; y++) {
            var row = [];
            for (var x = 0; x < dataWidth; x++) {
                // this makes foreground and background color to have a 43% (1/2.3) probability
                // spot color has 13% chance
                row[x] = Math.floor(rand() * 2.3);
            }
            var r = row.slice(0, mirrorWidth);
            r.reverse();
            row = row.concat(r);

            for (var i = 0; i < row.length; i++) {
                data.push(row[i]);
            }
        }

        return data;
    };

    var buildOpts = function buildOpts(address) {
        var newOpts = {};

        newOpts.seed = address;
        seedrand(newOpts.seed);

        newOpts.size = 11;
        newOpts.scale = 6;
        newOpts.color = createColor();
        newOpts.bgcolor = createColor();
        newOpts.spotcolor = createColor();

        return newOpts;
    };

    var renderIcon = function renderIcon(opts, canvas) {
        var imageData = createImageData(opts.size);
        var width = Math.sqrt(imageData.length);
        var cc = canvas.getContext('2d');

        canvas.width = canvas.height = opts.size * opts.scale;

        cc.clearRect(0, 0, canvas.width, canvas.height);
        cc.fillStyle = opts.bgcolor;
        cc.fillRect(0, 0, canvas.width, canvas.height);
        cc.fillStyle = opts.color;

        for (var i = 0; i < imageData.length; i++) {

            // if data is 0, leave the background
            if (imageData[i]) {
                var row = Math.floor(i / width);
                var col = i % width;

                // if data is 2, choose spot color, if 1 choose foreground
                cc.fillStyle = imageData[i] == 1 ? opts.color : opts.spotcolor;

                cc.fillRect(col * opts.scale, row * opts.scale, opts.scale, opts.scale);
            }
        }

        return canvas;
    };

    var hex_address = address.replace('x', '0');
    if (hex_address.match(/[0-9a-fA-F]{42}/ig)) {
        var opts = buildOpts(address);
        return renderIcon(opts, canvas);
    }
};

// self will be the dapp view. EX usage: setDappLocalState(this, { SchedulerViewType: view })
var setDappLocalState = function setDappLocalState(self, state) {
    return self.setState({ dappLocal: _extends({}, self.state.dappLocal, state) });
};

exports.createCanvasWithAddress = createCanvasWithAddress;
exports.setDappLocalState = setDappLocalState;