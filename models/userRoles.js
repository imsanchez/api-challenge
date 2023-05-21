"use strict";

const _ = require("lodash");
const Sequelize = require("sequelize");
const sequelize = require("../lib/sequelize.js");

const UserRoles = sequelize.define("UserRoles", {
  RoleId: {
    type: Sequelize.INTEGER,
    references: {
      model: "Roles",
      key: "id",
    },
  },
  UserId: {
    type: Sequelize.INTEGER,
    references: {
      model: "Users",
      key: "id",
    },
  },
  createdAt: {
    type: Sequelize.DATE,
    field: "created_at",
  },
  updatedAt: {
    type: Sequelize.DATE,
    field: "updated_at",
  },
});

module.exports = UserRoles;
