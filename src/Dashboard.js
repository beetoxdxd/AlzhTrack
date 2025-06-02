import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./auth/AuthContext";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [datos, setDatos] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    apellidoP: "",
    apellidoM: "",
    telefono: "",
    email: ""
  });
  // Añadido para el popup personalizado
  const [popup, setPopup] = useState({ show: false, success: false, message: "" });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // nuevo estado para la confirmación

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/datos");
        const data = await res.json();
        setDatos(data);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    if (user) {
      setForm({
        nombre: user.nombre,
        apellidoP: user.apellidoP,
        apellidoM: user.apellidoM,
        telefono: user.telefono,
        email: user.email
      });
    }
    fetchDatos();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const actualizarInfo = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/cuidadores/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setPopup({ show: true, success: true, message: "Información actualizada" });
        setTimeout(() => {
          setPopup({ show: false, success: false, message: "" });
          setShowModal(false);
        }, 1500);
      } else {
        setPopup({ show: true, success: false, message: "Error al actualizar" });
        setTimeout(() => setPopup({ show: false, success: false, message: "" }), 1500);
      }
    } catch (err) {
      setPopup({ show: true, success: false, message: "Error de red" });
      setTimeout(() => setPopup({ show: false, success: false, message: "" }), 1500);
    }
  };

  const borrarCuenta = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/cuidadores/${user._id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setPopup({ show: true, success: true, message: "Cuenta eliminada correctamente" });
        setTimeout(() => {
          setPopup({ show: false, success: false, message: "" });
          logout();
          navigate("/");
        }, 1500);
      } else {
        setPopup({ show: true, success: false, message: "Error al eliminar la cuenta" });
        setTimeout(() => setPopup({ show: false, success: false, message: "" }), 1500);
      }
    } catch (err) {
      setPopup({ show: true, success: false, message: "Error de red" });
      setTimeout(() => setPopup({ show: false, success: false, message: "" }), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f7fa] to-[#b2ebf2]">
      {/* Cambios en el header para fijarlo y elevar su z-index */}
      <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-[#3f535e] to-[#06354f] py-4 shadow-lg flex justify-between items-center px-6 animate-fade-in" style={{ zIndex: 1000 }}>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white focus:outline-none">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-50 animate-slide-down">
              <button
                onClick={() => { setShowModal(true); setMenuOpen(false); }}
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01" />
                </svg>
                Mi Información
              </button>
              <button
                onClick={() => { setMenuOpen(false); handleLogout(); }}
                className="flex items-center px-4 py-2 text-red-600 hover:bg-gray-100 w-full text-left"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
                </svg>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Se agrega un contenedor con padding-top para evitar que el contenido quede tapado */}
      <div className="pt-24">
        <div className="bg-white rounded-xl shadow-2xl p-6 z-1 animate-zoom-in">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
            Datos Recibidos
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-center border-collapse">
              <thead className="bg-[#B1E2D5] text-gray-800">
                <tr>
                  <th className="py-3 px-4 border">Fecha</th>
                  <th className="py-3 px-4 border">Frecuencia</th>
                  <th className="py-3 px-4 border">Oxígeno</th>
                  <th className="py-3 px-4 border">Latitud</th>
                  <th className="py-3 px-4 border">Longitud</th>
                </tr>
              </thead>
              <tbody>
                {datos.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-4 text-gray-500">No hay datos disponibles.</td>
                  </tr>
                ) : (
                  datos.map((dato) => (
                    <tr key={dato._id} className="hover:bg-gray-100 transition-colors duration-200">
                      <td className="py-2 px-4 border">{new Date(dato.fecha).toLocaleString("es-MX")}</td>
                      <td className="py-2 px-4 border">{dato.frecuencia}</td>
                      <td className="py-2 px-4 border">{dato.oxigeno}</td>
                      <td className="py-2 px-4 border">{dato.latitud}</td>
                      <td className="py-2 px-4 border">{dato.longitud}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Popup personalizado */}
        {popup.show && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 animate-popup-fade"
            style={{ zIndex: 1200 }}
            onClick={() => setPopup({ ...popup, show: false })}
          >
            <div
              className="bg-white rounded-xl shadow-2xl px-8 py-6 flex flex-col items-center animate-fade-in-up min-w-[280px] transition transform hover:scale-105"
              onClick={e => e.stopPropagation()}
            >
              {popup.success ? (
                <svg className="w-14 h-14 text-green-500 mb-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#d1fae5"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" stroke="#22c55e"/>
                </svg>
              ) : (
                <svg className="w-14 h-14 text-red-500 mb-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#fee2e2"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 9l-6 6m0-6l6 6" stroke="#ef4444"/>
                </svg>
              )}
              <span className={`text-lg font-semibold ${popup.success ? "text-green-600" : "text-red-600"}`}>
                {popup.message}
              </span>
            </div>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[1100] animate-popup-fade">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md max-h-[80vh] overflow-y-auto shadow-2xl transform transition-all duration-500 animate-fade-in-up">
              <h2 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#00DDDD] to-[#24E3D6]">
                Mi Información
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">Nombre</label>
                  <input
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Nombre"
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#24E3D6] transition transform hover:scale-105 hover:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">Apellido Paterno</label>
                  <input
                    name="apellidoP"
                    value={form.apellidoP}
                    onChange={handleChange}
                    placeholder="Apellido Paterno"
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#24E3D6] transition transform hover:scale-105 hover:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">Apellido Materno</label>
                  <input
                    name="apellidoM"
                    value={form.apellidoM}
                    onChange={handleChange}
                    placeholder="Apellido Materno"
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#24E3D6] transition transform hover:scale-105 hover:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">Teléfono</label>
                  <input
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    placeholder="Teléfono"
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#24E3D6] transition transform hover:scale-105 hover:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">Correo electrónico</label>
                  <input
                    name="email"
                    value={form.email}
                    disabled
                    className="w-full border border-gray-300 rounded-xl p-3 bg-gray-100"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <button
                  onClick={actualizarInfo}
                  className="flex-1 bg-gradient-to-r from-[#24E3D6] to-[#00DDDD] px-6 py-2 rounded-full text-white font-semibold transition transform hover:scale-105 hover:from-[#00DDDD] hover:to-[#24E3D6] hover:shadow-lg"
                >
                  Actualizar
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="ml-4 flex-1 border border-gray-300 px-6 py-2 rounded-full text-gray-600 transition transform hover:bg-gray-100 hover:scale-105 hover:shadow"
                >
                  Cancelar
                </button>
              </div>
              <hr className="my-6" />
              <div className="text-center">
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-sm text-red-600 border border-red-400 px-6 py-2 rounded-full transition transform hover:bg-red-200 hover:scale-105 hover:shadow"
                >
                  Eliminar cuenta
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Popup de confirmación de borrado */}
        {showDeleteConfirm && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[1200] animate-popup-fade"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <div
              className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl transform transition-all duration-500 animate-fade-in-up"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-center mb-4">Confirmación</h3>
              <p className="text-center text-gray-700 mb-6">
                ¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-around">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    borrarCuenta();
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-full transition transform hover:bg-red-700 hover:scale-105 hover:shadow-lg"
                >
                  Sí, eliminar
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-full transition transform hover:bg-gray-100 hover:scale-105 hover:shadow"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        <style>
          {`
            @keyframes zoom-in {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
            }
            .animate-zoom-in { animation: zoom-in 0.7s cubic-bezier(.4,0,.2,1) both; }
            @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
            .animate-fade-in { animation: fade-in 1s both; }
            @keyframes fade-in-up {
              from { opacity: 0; transform: translateY(40px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-up { animation: fade-in-up 0.7s both; }
            @keyframes slideDown {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-slide-down { animation: slideDown 0.3s ease-out both; }
            @keyframes popup-fade {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            .animate-popup-fade { animation: popup-fade 0.4s both; }
          `}
        </style>
      </div>
    </div>
  );
}
