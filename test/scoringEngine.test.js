'use strict';

const assert = require('node:assert/strict');
const {
  mapAnswersToValues,
  calculateRawScores,
  normalizeScores,
  scoreMagicArchetype,
  shouldTriggerUnnamed,
  shouldTriggerAbyssPrism,
} = require('../src/scoringEngine');

function testBasicMapping() {
  const values = mapAnswersToValues(['A', 'B', 'C', 'D', 'a', 'b', 'c', 'd', 'A', 'B', 'C', 'D', 'A', 'B', 'C', 'D']);
  assert.deepEqual(values, [-2, -1, 1, 2, -2, -1, 1, 2, -2, -1, 1, 2, -2, -1, 1, 2]);
}

function testRawAndNormalized() {
  const values = [2, 2, 2, 2, -2, -2, -2, -2, 1, 1, 1, 1, -1, -1, -1, -1];
  const raw = calculateRawScores(values);
  assert.deepEqual(raw, {
    cognition: 8,
    agency: -8,
    affect: 4,
    value: -4,
  });
  const normalized = normalizeScores(raw);
  assert.deepEqual(normalized, {
    cognition: 1,
    agency: -1,
    affect: 0.5,
    value: -0.5,
  });
}

function testUnnamedOverride() {
  const scores = { cognition: 0, agency: 0.125, affect: -0.125, value: 0.2 };
  assert.equal(shouldTriggerUnnamed(scores), true);
}

function testAbyssOverride() {
  const scores = { cognition: 1, agency: -1, affect: 0, value: 1 };
  assert.equal(shouldTriggerAbyssPrism(scores), true);
}

function testDeterministicResultShape() {
  const answers = ['C', 'D', 'D', 'C', 'D', 'C', 'D', 'C', 'D', 'C', 'D', 'C', 'D', 'D', 'C', 'C'];
  const first = scoreMagicArchetype(answers);
  const second = scoreMagicArchetype(answers);
  assert.deepEqual(first, second);

  assert.ok(first.main_role);
  assert.ok(first.secondary_role);
  assert.ok(first.mirror_role);
  assert.equal(typeof first.scores.cognition, 'number');
  assert.equal(typeof first.intensity.value, 'number');
}

function run() {
  testBasicMapping();
  testRawAndNormalized();
  testUnnamedOverride();
  testAbyssOverride();
  testDeterministicResultShape();
  console.log('All scoring engine tests passed.');
}

run();
