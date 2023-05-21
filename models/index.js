const User = require("./user.js");
const Role = require("./role.js");
const UserRoles = require("./userRoles.js");

User.belongsToMany(Role, {
  through: UserRoles,
});

Role.belongsToMany(User, {
  through: UserRoles,
});

module.exports = {
  User,
  Role,
  UserRoles,
};
