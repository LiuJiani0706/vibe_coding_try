(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.MagicArchetypeScoring = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const ANSWER_TO_VALUE = Object.freeze({
    A: -2,
    B: -1,
    C: 1,
    D: 2,
  });

  const DIMENSIONS = Object.freeze([
    'cognition',
    'agency',
    'affect',
    'value',
  ]);

  const ROLES = Object.freeze({
    '星蚀观测者': [1, -1, -1, -1],
    '灰烬女巫': [-1, 1, 1, 1],
    '苔原矮灵': [-1, -1, 1, -1],
    '镜域编译者': [1, 1, -1, -1],
    '夜航吟游者': [-1, -1, 1, 1],
    '断层执政官': [1, 1, -1, -1],
    '雾港调停人': [0, -1, 0, 0],
    '心焰塑形者': [-1, 1, 1, -1],
    '深渊折光体': [1, 0, -1, 1],
    '零号未命名者': [0, 0, 0, 0],
  });

  function validateAnswers(answers) {
    if (!Array.isArray(answers)) {
      throw new TypeError('answers must be an array of 16 options (A/B/C/D).');
    }

    if (answers.length !== 16) {
      throw new RangeError('answers length must be 16, got ' + answers.length + '.');
    }

    answers.forEach(function (answer, index) {
      if (typeof answer !== 'string' || !(answer.toUpperCase() in ANSWER_TO_VALUE)) {
        throw new TypeError(
          'Invalid answer at index ' + index + ': ' + String(answer) + '. Expected one of A/B/C/D.'
        );
      }
    });
  }

  function mapAnswersToValues(answers) {
    validateAnswers(answers);
    return answers.map(function (answer) {
      return ANSWER_TO_VALUE[answer.toUpperCase()];
    });
  }

  function calculateRawScores(answerValues) {
    return {
      cognition: answerValues.slice(0, 4).reduce(function (sum, v) { return sum + v; }, 0),
      agency: answerValues.slice(4, 8).reduce(function (sum, v) { return sum + v; }, 0),
      affect: answerValues.slice(8, 12).reduce(function (sum, v) { return sum + v; }, 0),
      value: answerValues.slice(12, 16).reduce(function (sum, v) { return sum + v; }, 0),
    };
  }

  function normalizeScores(rawScores) {
    return {
      cognition: rawScores.cognition / 8,
      agency: rawScores.agency / 8,
      affect: rawScores.affect / 8,
      value: rawScores.value / 8,
    };
  }

  function toVector(scores) {
    return DIMENSIONS.map(function (d) { return scores[d]; });
  }

  function euclideanDistance(v1, v2) {
    return Math.sqrt(v1.reduce(function (sum, value, i) {
      return sum + (value - v2[i]) * (value - v2[i]);
    }, 0));
  }

  function rankRolesByDistance(userVector) {
    return Object.keys(ROLES)
      .map(function (name) {
        return {
          name: name,
          distance: euclideanDistance(userVector, ROLES[name]),
        };
      })
      .sort(function (a, b) {
        if (a.distance !== b.distance) {
          return a.distance - b.distance;
        }
        return a.name.localeCompare(b.name, 'zh-Hans-CN');
      });
  }

  function countExtremeDimensions(userVector, threshold) {
    return userVector.filter(function (v) { return Math.abs(v) >= threshold; }).length;
  }

  function hasNonNaturalCombination(userScores, threshold) {
    const extremeCognition = Math.abs(userScores.cognition) >= threshold;
    const extremeValue = Math.abs(userScores.value) >= threshold;

    if (!extremeCognition || !extremeValue) {
      return false;
    }

    // Non-natural pair family:
    // rational + chaos (+/+) OR intuitive + order (-/-)
    return Math.sign(userScores.cognition) === Math.sign(userScores.value);
  }

  function shouldTriggerAbyssPrism(userScores) {
    const userVector = toVector(userScores);
    return countExtremeDimensions(userVector, 0.9) >= 2 && hasNonNaturalCombination(userScores, 0.9);
  }

  function shouldTriggerUnnamed(userScores) {
    return DIMENSIONS.every(function (dimension) {
      const value = userScores[dimension];
      return value >= -0.2 && value <= 0.2;
    });
  }

  function calculateMirrorRole(userVector) {
    const mirrorVector = userVector.map(function (v) { return -v; });
    return rankRolesByDistance(mirrorVector)[0].name;
  }

  function scoreMagicArchetype(answers) {
    const answerValues = mapAnswersToValues(answers);
    const rawScores = calculateRawScores(answerValues);
    const scores = normalizeScores(rawScores);
    const userVector = toVector(scores);

    const rankedRoles = rankRolesByDistance(userVector);
    let mainRole = rankedRoles[0].name;
    const secondaryRole = rankedRoles[1].name;

    if (shouldTriggerUnnamed(scores)) {
      mainRole = '零号未命名者';
    } else if (shouldTriggerAbyssPrism(scores)) {
      mainRole = '深渊折光体';
    }

    return {
      main_role: mainRole,
      secondary_role: secondaryRole,
      mirror_role: calculateMirrorRole(userVector),
      scores: scores,
      intensity: {
        cognition: Math.abs(scores.cognition),
        agency: Math.abs(scores.agency),
        affect: Math.abs(scores.affect),
        value: Math.abs(scores.value),
      },
    };
  }

  return {
    ANSWER_TO_VALUE: ANSWER_TO_VALUE,
    DIMENSIONS: DIMENSIONS,
    ROLES: ROLES,
    mapAnswersToValues: mapAnswersToValues,
    calculateRawScores: calculateRawScores,
    normalizeScores: normalizeScores,
    euclideanDistance: euclideanDistance,
    rankRolesByDistance: rankRolesByDistance,
    shouldTriggerAbyssPrism: shouldTriggerAbyssPrism,
    shouldTriggerUnnamed: shouldTriggerUnnamed,
    scoreMagicArchetype: scoreMagicArchetype,
  };
}));
