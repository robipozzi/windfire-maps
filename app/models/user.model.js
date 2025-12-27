// In-memory storage (replace with database in production)
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

class UserModel {
  static findAll() {
    return users;
  }

  static findById(id) {
    return users.find(u => u.id === parseInt(id));
  }

  static create(userData) {
    const newUser = {
      id: users.length + 1,
      ...userData,
      createdAt: new Date()
    };
    users.push(newUser);
    return newUser;
  }

  static update(id, userData) {
    const index = users.findIndex(u => u.id === parseInt(id));
    if (index === -1) return null;
    
    users[index] = { ...users[index], ...userData, updatedAt: new Date() };
    return users[index];
  }

  static delete(id) {
    const index = users.findIndex(u => u.id === parseInt(id));
    if (index === -1) return false;
    
    users.splice(index, 1);
    return true;
  }
}

module.exports = UserModel;