/**
 * Tests the two pure decisions in js/header.js. Run with `node --test test/`.
 *
 * The DOM wiring around them is exercised in a browser; these pin the behaviour
 * a change is most likely to break without anyone noticing.
 */
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { decideSlide, decideTransparency } = require('../js/header.js');

test('a few pixels of jitter never move the header, but small steps add up', () => {

    // Arrange
    const height = 64;
    const start = { isAway: false, anchor: 100 };

    // Act
    const afterJitter = decideSlide({ y: 103, height, isHeld: false, ...start });
    const afterSecondStep = decideSlide({ y: 105, height, isHeld: false, ...afterJitter });

    // Assert
    assert.deepEqual(afterJitter, start);
    assert.deepEqual(afterSecondStep, { isAway: true, anchor: 105 });

});

test('scrolling down slides the header away only past its own height', () => {

    // Arrange
    const start = { isAway: false, anchor: 0 };

    // Act and assert
    assert.equal(decideSlide({ y: 64, height: 64, isHeld: false, ...start }).isAway, false);
    assert.equal(decideSlide({ y: 65, height: 64, isHeld: false, ...start }).isAway, true);

});

test('the first upward scroll beyond the jitter brings the header back', () => {

    // Arrange
    const away = { isAway: true, anchor: 500 };

    // Act and assert
    assert.deepEqual(decideSlide({ y: 497, height: 64, isHeld: false, ...away }), away);
    assert.deepEqual(decideSlide({ y: 496, height: 64, isHeld: false, ...away }), { isAway: false, anchor: 496 });

});

test('the top of the page and anything holding the header keep it in view', () => {

    // Arrange
    const away = { isAway: true, anchor: 100 };

    // Act and assert
    assert.deepEqual(decideSlide({ y: 0, height: 64, isHeld: false, ...away }), { isAway: false, anchor: 0 });
    assert.deepEqual(decideSlide({ y: 900, height: 64, isHeld: true, ...away }), { isAway: false, anchor: 900 });

});

test('the header stays transparent on the way down until it has slid out of sight', () => {

    // Arrange
    const onTheWayDown = { y: 500, isHeld: false, isHidden: false, isTransparent: true };

    // Act and assert
    assert.equal(decideTransparency(onTheWayDown), true);
    assert.equal(decideTransparency({ ...onTheWayDown, isHidden: true }), false);

});

test('once opaque the header stays opaque until the reader is back above the threshold', () => {

    // Arrange
    const opaque = { isHeld: false, isHidden: false, isTransparent: false };

    // Act and assert
    assert.equal(decideTransparency({ ...opaque, y: 24 }), false);
    assert.equal(decideTransparency({ ...opaque, y: 23 }), true);

});

test('a header that cannot slide away turns opaque at the threshold, and not before', () => {

    // Arrange
    const held = { isHeld: true, isHidden: false, isTransparent: true };

    // Act and assert
    assert.equal(decideTransparency({ ...held, y: 23 }), true);
    assert.equal(decideTransparency({ ...held, y: 24 }), false);

});
