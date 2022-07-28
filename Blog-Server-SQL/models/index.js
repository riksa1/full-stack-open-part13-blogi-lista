const Blog = require('./blog');
const User = require('./user');
const UserReadings = require('./user_readings');
const Token = require('./token');

User.hasMany(Blog);
Blog.belongsTo(User);

// Token.hasOne(User);
// User.belongsTo(Token);

User.belongsToMany(Blog, { through: UserReadings, as: 'readings' });
// Blog.belongsToMany(User, { through: UserReadings, as: 'readingslists' });

module.exports = {
  Blog,
  User,
  UserReadings,
  Token,
};
