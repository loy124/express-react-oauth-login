'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // user: social_login은 1대 N 관계이다 
      // 외래키인 user_id 컬럼이 현재 User의 id 컬럼을 참조하고 있음
      models.user.hasMany(models['social_login'],{foreignKey:'user_id'})
    }
  };
  user.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    nickname: DataTypes.STRING,
    introduce: DataTypes.STRING,
    profile: DataTypes.STRING,
    type: DataTypes.INTEGER,
    email_authentication: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};