import MLBridge from '@/bridges/ml.bridge';

// Listen messages
process.on('message', async row => {
  const api = new MLBridge();
  console.log(row);
  process.exit();
});
