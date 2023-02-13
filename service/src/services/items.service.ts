import ItemModel from '@/database/models/Item.model';
import { Item } from '@/interfaces/database';

export default class ItemsService {
  public async createItem(item: Item) {
    return await ItemModel.create(item);
  }
}
