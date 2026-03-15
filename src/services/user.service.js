import ApiService from "./api.service";

class UserService extends ApiService {
  async getUsers() {
    return this.request("get", "users");
  }

  async deleteUser(id) {
    return this.request("delete", `user/${id}`);
  }

  async changePassword(userId, data) {
    return this.request("put", `user/${userId}/password`, data);
  }
}

const userServiceInstance = new UserService();
export default userServiceInstance;
