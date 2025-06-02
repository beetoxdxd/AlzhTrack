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
    navigate("/cuidadores/login");
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
        alert("Información actualizada");
        setShowModal(false);
      } else {
        alert("Error al actualizar");
      }
    } catch (err) {
      alert("Error de red");
    }
  };

  const borrarCuenta = async () => {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.");
    if (!confirmar) return;
    try {
      const res = await fetch(`http://localhost:3000/api/cuidadores/${user._id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        alert("Cuenta eliminada correctamente");
        logout();
        navigate("/cuidadores/login");
      } else {
        alert("Error al eliminar la cuenta");
      }
    } catch (err) {
      alert("Error de red");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f7fa] to-[#b2ebf2] p-6">
      {/* Header moderno */}
      <header className="bg-gradient-to-r from-[#3f535e] to-[#06354f] py-4 shadow-lg rounded-lg flex justify-between items-center px-6 mb-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white focus:outline-none">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 animate-slide-down">
              <button
                onClick={() => { setShowModal(true); setMenuOpen(false); }}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                Mi Información
              </button>
              <button
                onClick={handleLogout}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Contenedor de datos */}
      <div className="bg-white rounded-xl shadow-2xl p-6 animate-zoom-in">
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

      {/* Modal de edición */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 animate-popup-fade">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl animate-fade-in-up">
            <h2 className="text-xl font-bold text-center mb-4">Mi Información</h2>
            <div className="space-y-3">
              <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="w-full border rounded p-2" />
              <input name="apellidoP" value={form.apellidoP} onChange={handleChange} placeholder="Apellido Paterno" className="w-full border rounded p-2" />
              <input name="apellidoM" value={form.apellidoM} onChange={handleChange} placeholder="Apellido Materno" className="w-full border rounded p-2" />
              <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" className="w-full border rounded p-2" />
              <input name="email" value={form.email} disabled className="w-full border rounded p-2 bg-gray-100" />
            </div>
            <div className="mt-4 flex justify-between">
              <button onClick={actualizarInfo} className="bg-[#24E3D6] px-4 py-2 rounded text-black font-semibold hover:bg-[#1dd2c7] transition">
                Actualizar
              </button>
              <button onClick={() => setShowModal(false)} className="text-gray-600 hover:underline">
                Cancelar
              </button>
            </div>
            <hr className="my-4" />
            <div className="text-center">
              <button
                onClick={borrarCuenta}
                className="text-sm text-red-600 border border-red-400 px-4 py-2 rounded hover:bg-red-100 transition"
              >
                🗑️ Eliminar cuenta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animaciones personalizadas */}
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
  );
}
