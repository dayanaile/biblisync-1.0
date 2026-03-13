import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "../../../entities/user/model/use-auth-store";
import { Button } from "../../../shared/ui/button";
import { Input } from "../../../shared/ui/input";
import { LogIn, Mail, Lock, ShieldCheck, SquareCheck } from "lucide-react";
import biblioLogo from "../../../assets/biblioSync-logo.png";
import virtualLibraryIllustration from "../../../assets/virtual-library-illustration.png"; 
import { useEffect } from "react";

const loginSchema = z.object({
  email: z.string().email("Insira um e-mail válido"),
  password: z.string().min(6, "A senha deve ter ao menos 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { login, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    login(data.email);
    navigate({ to: "/" });
  };

  return (
      <div className="fixed inset-0 h-screen w-screen flex flex-col md:grid md:grid-cols-[1.1fr_0.9fr] items-center justify-center overflow-hidden bg-white z-[100]">
        
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full flex flex-col items-center justify-center p-4 md:p-8 h-full"
        >
          <div className="w-full max-w-[400px]">
            <div className="flex flex-col items-center md:items-start space-y-2 mb-4 w-full">
              <img src={biblioLogo} alt="BiblioSync" className="h-8 w-auto object-contain" />
              <div className="text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-heading text-slate-950 uppercase tracking-tighter leading-none">
                  Acesse sua <span className="text-[#FCA72C]">Estante</span>
                </h1>
                <p className="text-slate-600 text-[13px] font-light mt-1">Sincronize sua leitura em todos os dispositivos</p>
              </div>
            </div>

            <div className="w-full bg-white p-5 md:p-8 rounded-[24px] shadow-[0_10px_30px_-5px_rgba(114,91,58,0.1)] border border-white/80">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-700 uppercase tracking-wider pl-1">Seu melhor e-mail</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FCA72C] transition-colors" size={16} />
                    <Input
                      {...register("email")}
                      placeholder="exemplo@email.com"
                      className="pl-11 h-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus-visible:ring-2 focus-visible:ring-[#FCA72C]/40 outline-none"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-[10px] pl-2 font-medium">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-700 uppercase tracking-wider pl-1">Sua senha secreta</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FCA72C] transition-colors" size={16} />
                    <Input
                      {...register("password")}
                      type="password"
                      placeholder="••••••••"
                      className="pl-11 h-12 bg-slate-50 border-slate-200 text-slate-900 rounded-xl focus-visible:ring-2 focus-visible:ring-[#FCA72C]/40 outline-none"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-[10px] pl-2 font-medium">{errors.password.message}</p>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4 px-1 text-[11px] text-slate-700">
                    <div className="flex items-center gap-2 cursor-pointer">
                        <SquareCheck size={14} className="text-[#FCA72C]" />
                        <span>Lembrar de mim</span>
                    </div>
                    <span className="text-[#FCA72C] cursor-pointer hover:underline font-medium">Esqueceu a senha?</span>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-xl bg-[#FCA72C] hover:bg-[#FCA72C]/90 text-white font-bold text-sm uppercase tracking-widest shadow-md transition-all active:scale-95"
                >
                  {isSubmitting ? "Autenticando..." : "Entrar no BiblioSync"}
                </Button>
              </form>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[9px] text-slate-500 uppercase tracking-widest font-bold">
                <ShieldCheck size={12} className="text-emerald-500" />
                Conexão Segura
              </div>
            </div>
            
            <p className="mt-4 text-center text-slate-600 text-[11px]">
              Ainda não tem conta? <span className="text-[#FCA72C] font-semibold cursor-pointer hover:underline">Solicite acesso</span>
            </p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="hidden md:block relative h-full w-full bg-white overflow-hidden"
        >
          <img 
              src={virtualLibraryIllustration} 
              alt="Biblioteca Virtual" 
              className="w-full h-full object-cover" 
          />
          <div className="absolute inset-y-0 left-0 w-0 bg-[#F2E5D0] shadow-xl" />
        </motion.div>

      </div>
  );
}