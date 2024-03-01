const Blog = require('./blog');
const User = require('./user');
const Skim = require('./skim');
const Session = require('./session'); 

User.hasMany(Blog);
Blog.belongsTo(User);

User.hasMany(Skim);
Skim.belongsTo(User);

Blog.hasMany(Skim);
Skim.belongsTo(Blog);

User.hasMany(Session); 
Session.belongsTo(User); 

module.exports = { Blog, User, Skim, Session }; 