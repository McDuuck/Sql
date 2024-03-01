const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Blog extends Model {}

Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1991,
      max: 2024
    }
  },
  author: {
    type: DataTypes.TEXT
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})

module.exports = Blog