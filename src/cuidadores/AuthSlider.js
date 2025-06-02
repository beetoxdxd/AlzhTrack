import React, { useState } from "react";
import Login from "./login";
import Register from "./registro";

const AuthSlider = () => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#e0f7fa] to-[#b2ebf2] transition-colors duration-700">
      <div className="flex flex-1 justify-center items-center px-4 py-8">
        <div className="relative w-full max-w-4xl h-[80vh] min-h-[500px] rounded-2xl shadow-2xl overflow-hidden flex bg-white">
          {/* Slider content */}
          <div
            className="w-full h-full flex transition-transform duration-700"
            style={{
              transform: showLogin ? "translateX(0%)" : "translateX(-50%)",
              width: "200%",
            }}
          >
            {/* Login Form */}
            <div className="w-1/2 h-full flex items-center justify-center px-4 bg-white">
              <Login
                hideHeader={true}
                hideLinkToRegister={true}
                onSwitch={() => setShowLogin(false)}
              />
            </div>
            {/* Register Form */}
            <div className="w-1/2 h-full flex items-center justify-center px-4 bg-white">
              <Register
                hideHeader={true}
                hideLinkToLogin={true}
                onSwitch={() => setShowLogin(true)}
              />
            </div>
          </div>
          {/* Botón disparador, cambia de lado */}
          <div
            className={`absolute top-0 h-full w-1/2 flex items-center justify-center transition-all duration-700 z-10 pointer-events-none`}
            style={{
              left: showLogin ? "50%" : "0%",
              right: showLogin ? "0%" : "50%",
            }}
          >
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#00DDDD] to-[#9BDCFD]">
              <button
                className="bg-white text-[#00DDDD] font-bold py-4 px-10 rounded-full shadow-lg text-xl hover:bg-gray-100 transition-all duration-300 border-2 border-[#00DDDD] pointer-events-auto"
                style={{ minWidth: 200 }}
                onClick={() => setShowLogin((prev) => !prev)}
              >
                {showLogin ? "Registrarse" : "Iniciar Sesión"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSlider;
