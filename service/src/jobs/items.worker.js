const { workerData, parentPort, isMainThread } = require('worker_threads');
const MLBridge = require('../bridges/ml.bridge');
// Listen messages
const processData = async msg => {
  const API = new MLBridge();
  try {
    const item = await API.getItem(msg.site + msg.id, ['price', 'start_time', 'category_id', 'currency_id', 'seller_id']);
    const category = await API.getCategory(item.category_id, ['name']);
    const currency = await API.getCurrency(item.currency_id, ['description']);
    const seller = await API.getUser(item.seller_id.toString(), ['nickname']);
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
    parentPort.postMessage(record);
    process.exit(0);
  } catch (error) {
    // console.log(error);
    process.exit(-1);
  }
};
if (!isMainThread) {
  processData(workerData);
}
