import MLBridge from '@/bridges/ml.bridge';

interface Message {
  site: string;
  id: string;
}
interface Item {
  price: number;
  start_time: string;
  category_id: string;
  currency_id: string;
  seller_id: number;
}
// Listen messages
process.on('message', async (msg: Message) => {
  const API = new MLBridge();
  try {
    const item = await API.getItem<Item>(msg.site + msg.id, ['price', 'start_time', 'category_id', 'currency_id', 'seller_id']);
    const category = await API.getCategory<{ name: string }>(item.category_id, ['name']);
    const currency = await API.getCurrency<{ description: string }>(item.currency_id, ['description']);
    const seller = await API.getUser<{ nickname: string }>(item.seller_id.toString(), ['nickname']);
    const record = {
      site: msg.site,
      id: msg.id,
      price: item.price,
      start_time: item.start_time,
      name: category.name,
      description: currency.description,
      nickname: seller.nickname,
    };
    if (process.send) {
      process?.send(record);
    }
  } catch (error) {
    // console.log(error);
  } finally {
    process.exit();
  }
});
