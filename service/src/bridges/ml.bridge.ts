import axios from 'axios';
import { ML_API_SERVICE_URL } from '@/config';

export default class MLBridge {
  private API = axios.create({
    baseURL: ML_API_SERVICE_URL,
  });
  public async getItem(itemID: string, attributes: string[] = []) {
    const params = new URLSearchParams();
    if (attributes.length > 0) {
      // Select specific attributes
      params.set('attributes', attributes.toString());
    }
    return await this.API.get(`items/${itemID}?${params.toString()}`);
  }
}
