const axios = require('axios').default;
const { ML_API_SERVICE_URL } = require('../config');

class MLBridge {
  API = null;
  constructor(url = ML_API_SERVICE_URL) {
    this.API = axios.create({
      baseURL: url,
    });
  }
  async getItem(itemID, attributes = []) {
    const response = await this.API.get(`items/${itemID}?attributes=${attributes.toString()}`);
    return response.data;
  }
  async getCategory(categoryId, attributes = []) {
    const response = await this.API.get(`categories/${categoryId}?attributes=${attributes.toString()}`);
    return response.data;
  }
  async getCurrency(currencyId, attributes = []) {
    const response = await this.API.get(`currencies/${currencyId}?attributes=${attributes.toString()}`);
    return response.data;
  }
  async getUser(userId, attributes = []) {
    const response = await this.API.get(`users/${userId}?attributes=${attributes.toString()}`);
    return response.data;
  }
}
module.exports = MLBridge;
