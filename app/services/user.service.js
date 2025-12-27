const UserModel = require('../models/user.model');
const logger = require('../utils/logger');

class UserService {
  async getAllUsers() {
    try {
      logger.info('Fetching all users');
      return UserModel.findAll();
    } catch (error) {
      logger.error('Error in getAllUsers service:', error);
      throw error;
    }
  }

  async getUserById(id) {
    try {
      logger.info(`Fetching user with id: ${id}`);
      const user = UserModel.findById(id);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      return user;
    } catch (error) {
      logger.error(`Error in getUserById service: ${error.message}`);
      throw error;
    }
  }

  async createUser(userData) {
    try {
      logger.info('Creating new user');
      
      // Business logic validations
      if (!userData.email || !userData.name) {
        throw new Error('Name and email are required');
      }

      const existingUsers = UserModel.findAll();
      const emailExists = existingUsers.some(u => u.email === userData.email);
      
      if (emailExists) {
        throw new Error('Email already exists');
      }

      return UserModel.create(userData);
    } catch (error) {
      logger.error(`Error in createUser service: ${error.message}`);
      throw error;
    }
  }

  async updateUser(id, userData) {
    try {
      logger.info(`Updating user with id: ${id}`);
      
      const user = UserModel.update(id, userData);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      return user;
    } catch (error) {
      logger.error(`Error in updateUser service: ${error.message}`);
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      logger.info(`Deleting user with id: ${id}`);
      
      const deleted = UserModel.delete(id);
      
      if (!deleted) {
        throw new Error('User not found');
      }
      
      return { message: 'User deleted successfully' };
    } catch (error) {
      logger.error(`Error in deleteUser service: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new UserService();