import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "../../../entities/user/model/use-auth-store";
import { LogIn, Mail, Lock, ShieldCheck, CheckSquare } from "lucide-react";
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
    <div className="fixed inset-0 h-screen w-screen flex flex-col md:grid md:grid-cols-[1fr_1fr] items-center justify-center overflow-hidden bg-base-100 z-[100]">
      
      {/* COLUNA DO FORMULÁRIO */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full flex flex-col items-center justify-center p-6 md:p-12"
      >
        <div className="w-full max-w-[420px] space-y-8">
          
          {/* LOGO E HEADER */}
          <header className="flex flex-col items-center md:items-start gap-4">
            <img src={biblioLogo} alt="BiblioSync" className="h-10 w-auto" />
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-black text-base-content uppercase tracking-tighter leading-[0.8]">
                Acesse sua <br /> <span className="text-primary">Estante</span>
              </h1>
              <p className="text-sm opacity-60 font-medium mt-3">Sincronize sua leitura em todos os dispositivos</p>
            </div>
          </header>

          {/* CARD DO FORMULÁRIO */}
          <div className="card bg-base-100 border border-base-200 shadow-2xl p-8 rounded-[32px]">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              {/* CAMPO EMAIL */}
              <div className="form-control w-full">
                <label className="label py-1">
                  <span className="label-text text-[10px] font-black uppercase tracking-widest opacity-60">Seu melhor e-mail</span>
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 group-focus-within:text-primary transition-all" size={18} />
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="exemplo@email.com"
                    className={`input input-bordered w-full pl-12 rounded-2xl bg-base-200/50 border-base-300 focus:input-primary transition-all ${errors.email ? 'input-error' : ''}`}
                  />
                </div>
                {errors.email && (
                  <label className="label">
                    <span className="label-text-alt text-error font-bold">{errors.email.message}</span>
                  </label>
                )}
              </div>

              {/* CAMPO SENHA */}
              <div className="form-control w-full">
                <label className="label py-1">
                  <span className="label-text text-[10px] font-black uppercase tracking-widest opacity-60">Sua senha secreta</span>
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 group-focus-within:text-primary transition-all" size={18} />
                  <input
                    {...register("password")}
                    type="password"
                    placeholder="••••••••"
                    className={`input input-bordered w-full pl-12 rounded-2xl bg-base-200/50 border-base-300 focus:input-primary transition-all ${errors.password ? 'input-error' : ''}`}
                  />
                </div>
                {errors.password && (
                  <label className="label">
                    <span className="label-text-alt text-error font-bold">{errors.password.message}</span>
                  </label>
                )}
              </div>

              {/* OPÇÕES ADICIONAIS */}
              <div className="flex items-center justify-between px-1">
                <label className="label cursor-pointer gap-2">
                  <input type="checkbox" className="checkbox checkbox-primary checkbox-sm rounded-md" />
                  <span className="label-text text-xs font-bold opacity-70">Lembrar de mim</span>
                </label>
                <a href="#" className="text-xs font-bold text-primary hover:underline">Esqueceu a senha?</a>
              </div>

              {/* BOTÃO SUBMIT */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full h-14 rounded-2xl text-white font-black uppercase tracking-[0.2em] text-xs shadow-lg shadow-primary/20"
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <>
                    <LogIn size={18} />
                    Entrar no BiblioSync
                  </>
                )}
              </button>
            </form>

            {/* RODAPÉ DO CARD */}
            <div className="divider opacity-10"></div>
            <div className="flex items-center justify-center gap-2 text-[10px] opacity-40 uppercase font-black tracking-widest">
              <ShieldCheck size={14} className="text-success" />
              Conexão 256-bit SSL segura
            </div>
          </div>
          
          <p className="text-center text-sm font-medium opacity-60">
            Ainda não tem conta? <span className="text-primary font-bold cursor-pointer hover:underline">Solicite acesso</span>
          </p>
        </div>
      </motion.div>
      
      {/* COLUNA DA ILUSTRAÇÃO */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="hidden md:block relative h-full w-full bg-base-200"
      >
        <img 
            src={virtualLibraryIllustration} 
            alt="Biblioteca Virtual" 
            className="w-full h-full object-cover grayscale-[20%] contrast-[1.1]" 
        />
        {/* Camada de gradiente para suavizar a transição com o formulário */}
        <div className="absolute inset-0 bg-gradient-to-r from-base-100 via-transparent to-transparent" />
      </motion.div>

    </div>
  );
}