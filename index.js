const express = require('express'); // Importar express
const routerApi = require('./routes'); // Importar las rutas
const { logErrors, errorHandler, boomErrorHandler } = require('./middlewares/error.handler');
const app = express(); // Asignar express a mi aplicación
const port = 3000; // Asignación puerto donde se ejecutará el proy

const cors = require('cors');

// Configura CORS para permitir todas las solicitudes
app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hola servidor de express');
});

routerApi(app);

app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log('Mi puerto' + port);
});
