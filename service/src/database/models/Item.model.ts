import { Item } from '@/interfaces/database';
import { Schema, model } from 'mongoose';

const schema = new Schema<Item>({
  site: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  start_time: {
    type: Date,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  nickname: {
    type: String,
  },
});

const ItemModel = model<Item>('Item', schema);

export default ItemModel;
