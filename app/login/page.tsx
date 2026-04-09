"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import { Mail, IdCard, LogIn, Loader2 } from "lucide-react";
import { DM_Sans } from "next/font/google";

const dmsans = DM_Sans({ subsets: ["latin"] });

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formTeam, setFormTeam] = useState({
    correoElectronico: "",
    numeroDocumento: "",
  });

  const handleTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        correoElectronico: formTeam.correoElectronico,
        numeroDocumento: formTeam.numeroDocumento,
        redirect: false,
      });
      if (result?.error) {
        toast.error("Credenciales inválidas", {
          description: "Revisa tu correo y número de documento.",
        });
        setLoading(false);
      } else {
        toast.success("¡Acceso concedido!", {
          description: "Redirigiendo al panel de control...",
        });
        router.push("/dashboard");
      }
    } catch {
      toast.error("Error de servidor", {
        description: "Inténtalo de nuevo en unos minutos.",
      });
      setLoading(false);
    }
  };

  // InputCls actualizado con foco en el rango #374151
  const inputCls = `w-full px-4 py-3 pl-11 border border-gray-200 rounded-xl bg-white/50
    focus:bg-white focus:border-[#374151] focus:ring-4 focus:ring-[#374151]/10
    transition-all outline-none text-gray-700 placeholder-gray-400`;

  return (
    <div
      className={`relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 ${dmsans.className}`}
    >
      {/* Fondo decorativo en rango de grises pizarra */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#374151]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#374151]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-8 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-2xl shadow-sm flex items-center justify-center mb-4 transform hover:scale-105 transition-transform duration-300">
              <img
                src="/isologo.png"
                alt="Logo MEPER"
                className="w-24 h-24 object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-[#374151] tracking-tight">
              SOFA APP
            </h1>
            <p className="text-sm text-gray-500 mt-1 font-medium">
              Gestión Administrativa y Financiera
            </p>
          </div>

          <form
            onSubmit={handleTeam}
            className="space-y-5 animate-in fade-in duration-300"
          >
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#374151] uppercase tracking-wider flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" />
                Correo electrónico
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formTeam.correoElectronico}
                  onChange={(e) =>
                    setFormTeam({
                      ...formTeam,
                      correoElectronico: e.target.value,
                    })
                  }
                  placeholder="ejemplo@meper.com.co"
                  required
                  className={inputCls}
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#374151] uppercase tracking-wider flex items-center gap-2">
                <IdCard className="w-3.5 h-3.5" />
                Número de documento
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formTeam.numeroDocumento}
                  onChange={(e) =>
                    setFormTeam({
                      ...formTeam,
                      numeroDocumento: e.target.value,
                    })
                  }
                  placeholder="ID de usuario"
                  required
                  className={inputCls}
                />
                <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Botón con rango de color #374151 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#374151] hover:bg-[#1f2937] text-white font-semibold rounded-xl
                shadow-[0_10px_20px_-5px_rgba(55,65,81,0.3)] hover:shadow-[0_15px_25px_-5px_rgba(55,65,81,0.4)] 
                transform hover:scale-[1.01] active:scale-[0.99] transition-all duration-200
                disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100
                flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                    Iniciar sesión
                </>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-[10px] text-gray-400 font-medium tracking-widest uppercase">
            © {new Date().getFullYear()} MEPER Solutions
          </p>
        </div>
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            borderRadius: "16px",
            fontSize: "14px",
            fontFamily: "DM Sans, sans-serif",
            border: "1px solid #e5e7eb",
          },
        }}
      />
    </div>
  );
}