const mongoose = require('mongoose');

const DatoSchema = new mongoose.Schema({
  frecuencia: {type: Number, required: true},
  oxigeno: {type: Number, required: true},
  latitud: {type: Number, required: true},
  longitud: {type: Number, required: true},
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Dato', DatoSchema);
