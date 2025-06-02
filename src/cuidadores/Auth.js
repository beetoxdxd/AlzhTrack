import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Auth = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ show: false, success: false, message: "" });
  const [touched, setTouched] = useState({});
  const [pageLoaded, setPageLoaded] = useState(false);
  const [sliderAnim, setSliderAnim] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nombre: "",
    apellidoP: "",
    apellidoM: "",
    telefono: "",
  });

  React.useEffect(() => {
    setTimeout(() => setPageLoaded(true), 100); // animación de entrada
  }, []);

  // Validaciones
  const isEmailValid = emailRegex.test(form.email);
  const isEmailEmpty = form.email.trim() === "";
  const isPasswordEmpty = form.password.trim() === "";
  const isNombreEmpty = form.nombre.trim() === "";
  const isApellidoPEmpty = form.apellidoP.trim() === "";
  const isApellidoMEmpty = form.apellidoM.trim() === "";
  const isTelefonoEmpty = form.telefono.trim() === "";
  const isConfirmPasswordEmpty = form.confirmPassword.trim() === "";
  const passwordsMatch = form.password === form.confirmPassword;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!isEmailValid || isEmailEmpty || isPasswordEmpty) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/cuidadores/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (res.ok) {
        setPopup({ show: true, success: true, message: "Inicio de sesión exitoso" });
        setTimeout(() => {
          login(data.cuidador);
          navigate("/dashboard");
        }, 1500);
      } else {
        setPopup({ show: true, success: false, message: data.mensaje || "Error al iniciar sesión" });
        setLoading(false);
      }
    } catch (err) {
      setPopup({ show: true, success: false, message: "Error de conexión" });
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      setTouched({ email: true, nombre: true, apellidoP: true, apellidoM: true });
      if (isEmailValid && !isEmailEmpty && !isNombreEmpty && !isApellidoPEmpty && !isApellidoMEmpty) {
        setSliderAnim(true);
        setTimeout(() => {
          setStep(2);
          setSliderAnim(false);
        }, 500);
      }
      return;
    }
    setTouched({ ...touched, telefono: true, password: true, confirmPassword: true });
    if (isTelefonoEmpty || isPasswordEmpty || isConfirmPasswordEmpty || !passwordsMatch) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/cuidadores/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setPopup({ show: true, success: true, message: "Registro exitoso" });
        setTimeout(() => {
          setIsLogin(true);
          setStep(1);
          setForm({ ...form, password: "", confirmPassword: "" });
        }, 1500);
      } else {
        setPopup({ show: true, success: false, message: data.mensaje || "Error en el registro" });
      }
    } catch (err) {
      setPopup({ show: true, success: false, message: "Error de conexión" });
    }
    setLoading(false);
  };

  // Slider animation classes
  const sliderTransform = isLogin ? "translate-x-0" : "-translate-x-1/2";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#e0f7fa] to-[#b2ebf2] transition-colors duration-700">
      <div className="flex flex-1 justify-center items-center px-4 py-8">
        <div className={`relative w-full max-w-5xl h-[92vh] min-h-[700px] rounded-2xl shadow-2xl overflow-hidden bg-white flex
          ${pageLoaded ? "animate-zoom-in" : "opacity-0"}
        `}>
          {/* Contenedor partido con slider */}
          <div className={`w-[200%] h-full flex transition-transform duration-700 ease-in-out ${sliderTransform}`}>
            {/* Lado izquierdo */}
            <div className={`w-1/2 h-full flex items-center justify-center px-8 transition-all duration-700 ${isLogin ? "" : "bg-gradient-to-br from-[#00DDDD] to-[#9BDCFD]"}`}>
              {isLogin ? (
                // Formulario Login
                <form onSubmit={handleLoginSubmit} className="w-full max-w-md space-y-6 animate-fade-in delay-200">
                  <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-2 tracking-tight animate-fade-in">
                    Iniciar Sesión
                  </h1>
                  <p className="text-center text-gray-600 mb-6 animate-fade-in delay-100">
                    Ingresa a tu cuenta para acceder a la plataforma de monitoreo
                  </p>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Correo electrónico</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-4 focus:ring-[#00DDDD]/40 transition-all duration-300 shadow-lg hover:shadow-xl ${
                        touched.email && (isEmailEmpty || !isEmailValid)
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      required
                      autoComplete="username"
                      placeholder="ejemplo@correo.com"
                    />
                    {touched.email && isEmailEmpty && (
                      <p className="text-xs text-red-500 mt-1">El correo es obligatorio.</p>
                    )}
                    {touched.email && !isEmailEmpty && !isEmailValid && (
                      <p className="text-xs text-red-500 mt-1">Introduce un correo electrónico válido.</p>
                    )}
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Contraseña</label>
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-4 focus:ring-[#00DDDD]/40 transition-all duration-300 shadow-lg hover:shadow-xl ${
                        touched.password && isPasswordEmpty
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      required
                      autoComplete="current-password"
                      placeholder="Introduce tu contraseña"
                    />
                    {touched.password && isPasswordEmpty && (
                      <p className="text-xs text-red-500 mt-1">La contraseña es obligatoria.</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className={`w-full bg-[#9BDCFD] hover:bg-[#00DDDD] text-gray-800 font-bold py-3 px-4 rounded-lg shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#00DDDD]/40 flex items-center justify-center relative overflow-hidden ${
                      loading ? "pointer-events-none opacity-80" : ""
                    }`}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <span className="loader mr-2"></span>
                        Iniciando sesión...
                      </span>
                    ) : (
                      "Iniciar Sesión"
                    )}
                  </button>
                </form>
              ) : (
                // Contenedor exclusivo para el botón disparador (izquierdo)
                <div className="trigger-container animate-trigger-swap text-center">
                  <h2 className="text-3xl font-bold text-white mb-4 animate-fade-in-up">
                    ¿Ya tienes cuenta?
                  </h2>
                  <p className="text-white mb-8 animate-fade-in-up delay-100">
                    Inicia sesión para continuar con tu monitoreo
                  </p>
                  <button
                    onClick={() => {
                      setIsLogin(true);
                      setStep(1);
                      setTouched({});
                    }}
                    className="bg-white text-[#00DDDD] font-bold py-3 px-10 rounded-full shadow-lg text-xl hover:bg-gray-100 transition-all duration-300 border-2 border-[#00DDDD] animate-bounce-in"
                    style={{ minWidth: 200 }}
                  >
                    Iniciar Sesión
                  </button>
                </div>
              )}
            </div>
            {/* Lado derecho */}
            <div className={`w-1/2 h-full flex items-center justify-center px-8 transition-all duration-700 ${isLogin ? "bg-gradient-to-br from-[#00DDDD] to-[#9BDCFD]" : ""}`}>
              {isLogin ? (
                // Contenedor exclusivo para el botón disparador (derecho)
                <div className="trigger-container animate-trigger-swap text-center">
                  <h2 className="text-3xl font-bold text-white mb-4 animate-fade-in-up">
                    ¿Nuevo aquí?
                  </h2>
                  <p className="text-white mb-8 animate-fade-in-up delay-100">
                    Regístrate y comienza a monitorear a tus pacientes
                  </p>
                  <button
                    onClick={() => {
                      setIsLogin(false);
                      setStep(1);
                      setTouched({});
                    }}
                    className="bg-white text-[#00DDDD] font-bold py-3 px-10 rounded-full shadow-lg text-xl hover:bg-gray-100 transition-all duration-300 border-2 border-[#00DDDD] animate-bounce-in"
                    style={{ minWidth: 200 }}
                  >
                    Registrarse
                  </button>
                </div>
              ) : (
                // Formulario Registro
                <form onSubmit={handleRegisterSubmit} className={`w-full max-w-md space-y-6 animate-fade-in delay-200 ${sliderAnim ? "opacity-50" : ""}`}>
                  <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-2 tracking-tight animate-fade-in">
                    Registro
                  </h1>
                  <p className="text-center text-gray-600 mb-6 animate-fade-in delay-100">
                    Crea tu cuenta de cuidador para acceder al sistema de monitoreo.
                  </p>
                  {step === 1 ? (
                    <>
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Correo electrónico</label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-4 focus:ring-[#00DDDD]/40 transition-all duration-300 shadow-sm hover:shadow-md ${
                            touched.email && (isEmailEmpty || !isEmailValid)
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          required
                          autoComplete="username"
                          placeholder="cuidador@correo.com"
                        />
                        {touched.email && isEmailEmpty && (
                          <p className="text-xs text-red-500 mt-1">El correo es obligatorio.</p>
                        )}
                        {touched.email && !isEmailEmpty && !isEmailValid && (
                          <p className="text-xs text-red-500 mt-1">Introduce un correo electrónico válido.</p>
                        )}
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Nombre</label>
                        <input
                          type="text"
                          name="nombre"
                          value={form.nombre}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-4 focus:ring-[#00DDDD]/40 transition-all duration-300 shadow-sm hover:shadow-md ${
                            touched.nombre && isNombreEmpty
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          required
                          placeholder="Nombre(s)"
                        />
                        {touched.nombre && isNombreEmpty && (
                          <p className="text-xs text-red-500 mt-1">El nombre es obligatorio.</p>
                        )}
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Apellido paterno</label>
                        <input
                          type="text"
                          name="apellidoP"
                          value={form.apellidoP}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-4 focus:ring-[#00DDDD]/40 transition-all duration-300 shadow-sm hover:shadow-md ${
                            touched.apellidoP && isApellidoPEmpty
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          required
                          placeholder="Apellido paterno"
                        />
                        {touched.apellidoP && isApellidoPEmpty && (
                          <p className="text-xs text-red-500 mt-1">El apellido paterno es obligatorio.</p>
                        )}
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Apellido materno</label>
                        <input
                          type="text"
                          name="apellidoM"
                          value={form.apellidoM}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-4 focus:ring-[#00DDDD]/40 transition-all duration-300 shadow-sm hover:shadow-md ${
                            touched.apellidoM && isApellidoMEmpty
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          required
                          placeholder="Apellido materno"
                        />
                        {touched.apellidoM && isApellidoMEmpty && (
                          <p className="text-xs text-red-500 mt-1">El apellido materno es obligatorio.</p>
                        )}
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-[#24E3D6] text-black font-bold py-2 px-4 rounded-md hover:bg-[#1dd2c7] focus:outline-none transition-all duration-200 relative overflow-hidden"
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="flex items-center">
                            <span className="loader mr-2"></span>
                            Siguiente...
                          </span>
                        ) : (
                          "Siguiente"
                        )}
                      </button>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Número telefónico</label>
                        <input
                          type="tel"
                          name="telefono"
                          value={form.telefono}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-4 focus:ring-[#00DDDD]/40 transition-all duration-300 shadow-sm hover:shadow-md ${
                            touched.telefono && isTelefonoEmpty
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          required
                          placeholder="55XXXXXXXX"
                        />
                        {touched.telefono && isTelefonoEmpty && (
                          <p className="text-xs text-red-500 mt-1">El teléfono es obligatorio.</p>
                        )}
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Contraseña</label>
                        <input
                          type="password"
                          name="password"
                          value={form.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-4 focus:ring-[#00DDDD]/40 transition-all duration-300 shadow-sm hover:shadow-md ${
                            touched.password && isPasswordEmpty
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          required
                          placeholder="Crea una contraseña"
                        />
                        {touched.password && isPasswordEmpty && (
                          <p className="text-xs text-red-500 mt-1">La contraseña es obligatoria.</p>
                        )}
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Confirmar contraseña</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={form.confirmPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-4 focus:ring-[#00DDDD]/40 transition-all duration-300 shadow-sm hover:shadow-md ${
                            touched.confirmPassword && (isConfirmPasswordEmpty || !passwordsMatch)
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          required
                          placeholder="Confirma tu contraseña"
                        />
                        {touched.confirmPassword && isConfirmPasswordEmpty && (
                          <p className="text-xs text-red-500 mt-1">La confirmación es obligatoria.</p>
                        )}
                        {touched.confirmPassword && !isConfirmPasswordEmpty && !passwordsMatch && (
                          <p className="text-xs text-red-500 mt-1">Las contraseñas no coinciden.</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="w-1/2 bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none transition-all duration-200"
                        >
                          Atrás
                        </button>
                        <button
                          type="submit"
                          className="w-1/2 bg-[#24E3D6] text-black font-bold py-2 px-4 rounded-md hover:bg-[#1dd2c7] focus:outline-none transition-all duration-200 flex items-center justify-center relative overflow-hidden"
                          disabled={loading}
                        >
                          {loading ? (
                            <span className="flex items-center">
                              <span className="loader mr-2"></span>
                              Registrando...
                            </span>
                          ) : (
                            "Registrarse"
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Popup de notificación */}
      {popup.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30 animate-popup-fade" onClick={() => setPopup({ ...popup, show: false })}>
          <div
            className="bg-white rounded-xl shadow-2xl px-8 py-6 flex flex-col items-center animate-fade-in-up min-w-[280px] scale-105 relative"
            onClick={e => e.stopPropagation()}
          >
            {popup.success ? (
              <svg className="w-14 h-14 text-green-500 mb-2 animate-bounce-in" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#d1fae5"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" stroke="#22c55e"/>
              </svg>
            ) : (
              <svg className="w-14 h-14 text-red-500 mb-2 animate-bounce-in" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#fee2e2"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 9l-6 6m0-6l6 6" stroke="#ef4444"/>
              </svg>
            )}
            <span className={`text-lg font-semibold ${popup.success ? "text-green-600" : "text-red-600"}`}>
              {popup.message}
            </span>
            <button
              className="mt-4 px-6 py-2 rounded bg-[#00DDDD] text-white font-bold shadow hover:bg-[#00b3b3] transition"
              onClick={() => setPopup({ ...popup, show: false })}
              autoFocus
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
      {/* Animaciones personalizadas */}
      <style>
        {`
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(40px);}
            to { opacity: 1; transform: translateY(0);}
          }
          @keyframes fade-in {
            from { opacity: 0;}
            to { opacity: 1;}
          }
          @keyframes slide-step {
            0% { opacity: 1; }
            50% { opacity: 0.5; transform: scale(0.98); }
            100% { opacity: 1; }
          }
          @keyframes zoom-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes popup-fade {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes bounce-in {
            0% { transform: scale(0.7); }
            60% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          @keyframes trigger-swap {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up { animation: fade-in-up 0.7s cubic-bezier(.4,0,.2,1) both; }
          .animate-fade-in { animation: fade-in 1s both; }
          .animate-slide-step { animation: slide-step 0.5s; }
          .animate-zoom-in { animation: zoom-in 0.7s cubic-bezier(.4,0,.2,1) both; }
          .animate-popup-fade { animation: popup-fade 0.4s; }
          .animate-bounce-in { animation: bounce-in 0.5s; }
          .animate-trigger-swap { animation: trigger-swap 0.5s ease-out both; }
          .delay-100 { animation-delay: 0.1s; }
          .delay-200 { animation-delay: 0.2s; }
          .loader {
            border: 3px solid #e0f7fa;
            border-top: 3px solid #00DDDD;
            border-radius: 50%;
            width: 22px;
            height: 22px;
            animation: spin 0.7s linear infinite;
            display: inline-block;
            vertical-align: middle;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Auth;
