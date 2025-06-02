require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const datosRoutes = require('./routes/datos');
const cuidadoresRoutes = require('./routes/cuidadores');
const ttgoRoutes = require('./routes/ttgo');

const app = express();
app.use(cors());
app.use(express.json());

const swaggerUI = require('swagger-ui-express');
const swaggerDocumentation = require('./swagger.json');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Error al conectar MongoDB:', err));

app.use('/api/doc', swaggerUI.serve, swaggerUI.setup(swaggerDocumentation));
app.use('/api/datos', datosRoutes);
app.use('/api/cuidadores', cuidadoresRoutes);
app.use('/api/ttgo', ttgoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
