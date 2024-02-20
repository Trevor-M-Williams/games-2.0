const scoreMap = {
  1: 0,
  2: 0,
  3: 1,
  6: 2,
  12: 3,
  24: 4,
  48: 5,
  96: 6,
  192: 7,
  384: 8,
  768: 9,
  1536: 10,
  3072: 11,
  6144: 12,
};

function getBonusTile(highTile) {
  const exponent = scoreMap[highTile];
  const bonusExponentMin = 2;
  const bonusExponentMax = exponent - 3;
  const randomExponent =
    bonusExponentMin +
    Math.floor(Math.random() * (bonusExponentMax - bonusExponentMin));
  const bonusTile = 3 * 2 ** randomExponent;

  return bonusTile;
}

const results = {};

for (let i = 1; i <= 1000; i++) {
  const bonusTile = getBonusTile(3072);
  results[bonusTile] = (results[bonusTile] || 0) + 1;
}

console.log(results);
