const App = require('./app.js');
const ImportRoute = require('./routes/import.route.js');

const app = new App([new ImportRoute()]);

app.listen();
