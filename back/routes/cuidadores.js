const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const router = express.Router();

const Cuidador = require('../models/Cuidador');
const Counter = require('../models/Counter');

const JWT_SECRET = 'clave_secreta'; // Puedes mover esto a .env si usas dotenv

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'alzhtrack@gmail.com',
    pass: 'wmpk fsmb crmh fujp'
  }
});


router.post('/register', async (req, res) => {
  try {
    /*
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        nombre: 'Alberto',
        apellidoP: 'Vega',
        apellidoM: 'Monterrubio',
        email: 'example@gmail.com',
        telefono: '5512345688',
        password: 'pass'
      }
    }
    */
    const { nombre, apellidoP, apellidoM, email, telefono, password } = req.body;

    const existing = await Cuidador.findOne({ email });
    if (existing) return res.status(400).json({ mensaje: 'Correo ya registrado' });

    const hash = await bcrypt.hash(password, 10);

    let counter = await Counter.findOneAndUpdate(
      { name: 'cuidador' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const nuevoCuidador = new Cuidador({
      id_cuidador: counter.seq,
      nombre,
      apellidoP,
      apellidoM,
      email,
      telefono,
      password: hash,
      verificado: false 
    });

    await nuevoCuidador.save();

    const token = jwt.sign({ id: nuevoCuidador._id }, JWT_SECRET, { expiresIn: '1d' });
    const enlace = `http://localhost:3000/api/cuidadores/verificar/${token}`;

    await transporter.sendMail({
      from: '"AlzhTrack" <alzhtrack@gmail.com>',
      to: email,
      subject: "Verifica tu cuenta en AlzhTrack",
      html: `
        <h3>Hola ${nombre},</h3>
        <p>Gracias por registrarte. Por favor verifica tu correo dando clic en el siguiente enlace:</p>
        <a href="${enlace}">Verificar cuenta</a>
        <p>Este enlace expirará en 24 horas.</p>
      `
    });

    res.status(201).json({ mensaje: 'Registro exitoso. Revisa tu correo para verificar la cuenta.' });

  } catch (error) {
    console.error("Error al registrar cuidador:", error);
    res.status(500).json({ mensaje: 'Error en el registro.', error });
  }
});


router.get('/verificar/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, JWT_SECRET);
    await Cuidador.findByIdAndUpdate(decoded.id, { verificado: true });
    res.send('<h2>Cuenta verificada correctamente. Ya puedes iniciar sesión.</h2>');
  } catch (err) {
    res.status(400).send('<h2>Token inválido o expirado.</h2>');
  }
});


router.post('/login', async (req, res) => {
  /*
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        email: 'example@gmail.com',
        password: 'pass'
      }
    }
    */
  const { email, password } = req.body;

  try {
    const cuidador = await Cuidador.findOne({ email });
    if (!cuidador) {
      return res.status(401).json({ mensaje: 'Correo no registrado' });
    }

    const match = await bcrypt.compare(password, cuidador.password);
    if (!match) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    if (!cuidador.verificado) {
      return res.status(403).json({ mensaje: 'Verifica tu correo antes de iniciar sesión' });
    }

    res.json({ mensaje: 'Inicio de sesión correcto', cuidador });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error del servidor', error: err.message });
  }
});

// ACTUALIZAR
router.put("/:id", async (req, res) => {
  try {
    /*
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        nombre: 'Alberto',
        apellidoP: 'Vega',
        apellidoM: 'Monterrubio',
        email: 'example@gmail.com',
        telefono: '5512345688'
      }
    }
    */
    const actualizado = await Cuidador.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(actualizado);
  } catch (err) {
    res.status(500).json({ mensaje: "Error actualizando cuidador" });
  }
});

// BORRAR
router.delete("/:id", async (req, res) => {
  try {
    await Cuidador.findByIdAndDelete(req.params.id);
    res.status(200).json({ mensaje: "Cuenta eliminada" });
  } catch (err) {
    res.status(500).json({ mensaje: "Error eliminando cuidador" });
  }
});

module.exports = router;
