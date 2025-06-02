const mongoose = require('mongoose');

const CuidadorSchema = new mongoose.Schema({
  id_cuidador: { type: Number, unique: true },
  nombre: { type: String, required: true },
  apellidoP: { type: String, required: true },
  apellidoM: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telefono: { type: String, required: true },
  password: { type: String, required: true },
  id_paciente: { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente', default: null },
  verificado: { type: Boolean, default: false }
});

module.exports = mongoose.model('Cuidador', CuidadorSchema);
