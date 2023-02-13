import axios from 'axios';
import { ML_API_SERVICE_URL } from '@/config';

export default class MLBridge {
  private API = axios.create({
    baseURL: ML_API_SERVICE_URL,
  });
  public async getItem<ItemType>(itemID: string, attributes: string[] = []): Promise<Awaited<ItemType>> {
    const response = await this.API.get(`items/${itemID}?attributes=${attributes.toString()}`);
    return response.data;
  }
  public async getCategory<ItemType>(categoryId: string, attributes: string[] = []): Promise<Awaited<ItemType>> {
    const response = await this.API.get(`categories/${categoryId}?attributes=${attributes.toString()}`);
    return response.data;
  }
  public async getCurrency<ItemType>(currencyId: string, attributes: string[] = []): Promise<Awaited<ItemType>> {
    const response = await this.API.get(`currencies/${currencyId}?attributes=${attributes.toString()}`);
    return response.data;
  }
  public async getUser<ItemType>(userId: string, attributes: string[] = []): Promise<Awaited<ItemType>> {
    const response = await this.API.get(`users/${userId}?attributes=${attributes.toString()}`);
    return response.data;
  }
}
