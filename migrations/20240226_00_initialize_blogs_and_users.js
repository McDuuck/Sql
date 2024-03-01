const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('blogs', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      author: {
        type: DataTypes.TEXT
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1991,
            max: 2024
        }
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
        timestamps: true,
        createdAt: true,
        updatedAt: true
    })
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true
        }
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      disabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
    }, {
        timestamps: true,
        createdAt: true,
        updatedAt: true
    })
    await queryInterface.addColumn('blogs', 'user_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('blogs')
    await queryInterface.dropTable('users')
  },
}