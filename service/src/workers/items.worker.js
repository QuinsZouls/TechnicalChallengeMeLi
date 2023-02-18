const { parentPort, isMainThread } = require('worker_threads');
const MLBridge = require('../bridges/ml.bridge');

const processData = async msg => {
  const API = new MLBridge();
  const item = await API.getItem(msg.site + msg.id, ['price', 'start_time', 'category_id', 'currency_id', 'seller_id']);
  const [category, currency, seller] = await Promise.all([
    API.getCategory(item.category_id, ['name']),
    API.getCurrency(item.currency_id, ['description']),
    API.getUser(item.seller_id.toString(), ['nickname']),
  ]);
  const record = {
    site: msg.site,
    id: msg.id,
    price: item.price,
    start_time: item.start_time,
    name: category.name,
    description: currency.description,
    nickname: seller.nickname,
  };
  parentPort.postMessage({
    status: 1,
    data: record,
  });
};
if (!isMainThread) {
  parentPort.on('message', async row => {
    try {
      await processData(row);
      // Send success status
    } catch (error) {
      parentPort.postMessage({
        status: 0,
      });
    }
  });
}
