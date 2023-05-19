const _ = require("lodash");
const { server } = require("../lib/hapi.js");
const sequelize = require("../lib/sequelize.js");

const resetTable = (modelName) => {
  if (modelName === "Utils") return;
  if (!modelName) throw new Error("modelName undefined");
  return sequelize.models[modelName].sync({ force: true, logging: false });
};

const resetDb = async () => {
  await resetTable("User");
  await resetTable("Role");
  await resetTable("UserRole");
  return Promise.resolve();
};

const setupDb = async () => {
  try {
    await resetDb();
    await sequelize.models.Role.createDefaultRoles();
  } catch (err) {
    console.error(err);
  }
};

/**
 * Assign a role to a given user
 */
const assignRoleForUser = async ({ user, roleName }) => {
  const role = await sequelize.models.Role.findOne({
    where: { name: roleName },
  });
  return sequelize.models.UserRole.create({
    userId: user.id,
    roleId: role.id,
  });
};

const uri = `${server.info.uri}/v0`;

module.exports = {
  server,
  sequelize,
  resetTable,
  resetDb,
  setupDb,
  assignRoleForUser,
};
