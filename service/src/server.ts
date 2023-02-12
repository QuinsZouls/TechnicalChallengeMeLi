import App from '@/app';
import ImportRoute from '@/routes/import.route';
const app = new App([new ImportRoute()]);

app.listen();
