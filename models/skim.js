const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Skim extends Model {}

Skim.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    blog_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'blogs',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM,
      values: ['unread', 'read'],
      allowNull: false
    },
  }, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'skim',
    tableName: 'skim',
  });
module.exports = Skim