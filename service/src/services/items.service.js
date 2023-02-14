const ItemModel = require("../models/Item.model");


class ItemsService {
  async createItem(item) {
    return await ItemModel.create(item);
  }
}

module.exports = ItemsService;
