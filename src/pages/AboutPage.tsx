import { Github, Linkedin } from "lucide-react";
import profileImg from "@/assets/profile.png";

export default function AboutPage() {
  return (
    <div className="flex justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="bg-gray-700/20 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden">
          <div className="p-6 flex flex-col sm:flex-row gap-6">
            <div className="flex flex-col items-center gap-3 shrink-0">
              <div className="w-36 h-36 rounded-2xl border-2 border-cyan-500/50 overflow-hidden bg-white/5">
                <img
                  src={profileImg}
                  alt="Léo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex-1 text-white/70 text-sm leading-relaxed flex flex-col gap-4">
              <p>
                Olá, eu me chamo{" "}
                <strong className="text-white font-bold">Léo!</strong> Acredito
                que programar é sobre resolver problemas do mundo real – e o meu
                era simples: cansei de tomar chuva de surpresa andando de moto!
              </p>
              <p>
                Para resolver isso, construí esse app de clima utilizando{" "}
                <a
                  href="https://react.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  React{" "}
                </a>
                +{" "}
                <a
                  href="https://tailwindcss.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Tailwind
                </a>
                ,{" "}
                <a
                  href="https://nestjs.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  NestJS
                </a>{" "}
                com autenticação JWT, envio de notificações via{" "}
                <a
                  href="https://firebase.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Firebase
                </a>{" "}
                e banco de dados{" "}
                <a
                  href="https://www.postgresql.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Postgres
                </a>
                .
              </p>
              <p>
                Sou um desenvolvedor focado em evolução contínua, sempre
                estudando e buscando meu próximo grande desafio profissional.
                Para conhecer outras soluções que criei, acesse mais projetos no{" "}
                <a
                  href="https://leonardorodrigues.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-0.5"
                >
                  meu portfólio
                </a>
                .
              </p>
            </div>
          </div>

          <div className="border-t border-white/10 grid grid-cols-2">
            <a
              href="https://github.com/Leorodrigs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-4 text-white/70 hover:text-white hover:bg-white/5 transition-all border-r border-white/10 font-semibold text-sm"
            >
              <Github size={18} />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/leorodrigues-dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-4 font-bold text-sm bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 hover:from-cyan-500/30 hover:to-indigo-500/30 text-cyan-300 transition-all"
            >
              <Linkedin size={18} />
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
