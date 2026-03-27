const key = process.env.JWT_SECRET;
const membershipAmount = {
  silver: 50000,
  gold: 100000,
}

module.exports = {
  key,
  membershipAmount,
};
