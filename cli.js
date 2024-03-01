require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL)

const main = async () => {
    try {
      await sequelize.authenticate()
      const blogs = await sequelize.query('SELECT * FROM blogs', { type: QueryTypes.SELECT })
      const formattedBlogs = blogs.map(blog => `${blog.author}: '${blog.title}', ${blog.likes} likes`)
      console.log(formattedBlogs)
      sequelize.close()
    } catch (error) {
      console.error('Unable to connect to the database:', error)
    }
  }
  
  main()