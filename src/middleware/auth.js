const adminAuth = (req, res, next) => {
  const token = "xyz";
  const isAdmin = token === "xyz";
  if (!isAdmin) {
    res.status(401).send("Unauthorized Access");
    return;
  } else {
    next();
  }
};
const UserAuth = (req, res, next) => {
  const token = "xyz";
  const isAdmin = token === "xyz";
  if (!isAdmin) {
    res.status(401).send("Unauthorized Access");
    return;
  } else {
    next();
  }
};
module.exports = {
    adminAuth,
    UserAuth,
}
