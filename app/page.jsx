"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect } from "react";

export default function Home() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const videoEl = document.querySelector("#video");
    const container = document.querySelector("#video-section");
    const textEl = document.querySelector("#hero-text");

    if (!videoEl || !container || !textEl) {
      return undefined;
    }

    let scrollTriggerInstance;
    let textAnimation;
    const updateCurrentTime = (progress) => {
      if (!videoEl.duration) return;
      videoEl.currentTime = progress * videoEl.duration;
    };

    const createScrollTrigger = () => {
      if (!videoEl.duration) {
        return;
      }

      videoEl.pause();
      updateCurrentTime(0);

      const distancePerSecond = 450;
      const getScrollDistance = () =>
        Math.max(
          window.innerHeight * 1.6,
          videoEl.duration * distancePerSecond
        );

      textAnimation?.kill();
      scrollTriggerInstance?.kill();

      textAnimation = gsap.to(textEl, {
        opacity: 0,
        y: 72,
        ease: "power2.out",
        duration: 1,
        paused: true,
      });

      textAnimation.progress(0).pause();

      scrollTriggerInstance = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: () => `+=${getScrollDistance()}`,
        scrub: 3,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          updateCurrentTime(self.progress);
          textAnimation.progress(Math.min(self.progress * 1.1, 1));
        },
        onLeave: () => {
          updateCurrentTime(1);
          textAnimation.progress(1);
        },
        onLeaveBack: () => {
          updateCurrentTime(0);
          textAnimation.progress(0);
        },
      });

      ScrollTrigger.refresh();
    };

    const handleLoadedMetadata = () => {
      createScrollTrigger();
      videoEl.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };

    if (videoEl.readyState >= 1) {
      createScrollTrigger();
    } else {
      videoEl.addEventListener("loadedmetadata", handleLoadedMetadata);
    }

    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      scrollTriggerInstance?.kill();
      textAnimation?.kill();
      window.removeEventListener("resize", handleResize);
      videoEl.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  return (
    <main className="bg-white text-gray-900">
      <section className="relative min-h-screen bg-black text-white">
        <div
          id="video-section"
          className="relative flex h-screen w-full items-center justify-center overflow-hidden"
        >
          <video
            className="video-bg absolute inset-0 h-full w-full object-cover"
            src="video/praia.mp4"
            muted
            preload="auto"
            playsInline
            id="video"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-tranparent via-black/40 to-tranparent" />
          <div
            id="hero-text"
            className="relative z-10 max-w-4xl space-y-6 px-6 text-center"
          >
            <p className="text-xs uppercase tracking-[0.6em] text-slate-200">
              Exemplo
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Titulo chamativo sobre o seu projeto aqui
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-200/80">
              Use este bloco para compartilhar uma mensagem curta enquanto o
              video de fundo cria a atmosfera desejada. Edite o texto como
              quiser.
            </p>
          </div>
        </div>
      </section>
      <section className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-500 via-blue-300 to-white px-6">
        <div className="max-w-3xl space-y-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
            Proxima secao
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-slate-600">
            Espaco para voce continuar o layout.
          </h2>
          <p className="text-lg text-slate-600">
            Esta area e apenas um placeholder para testar a transicao apos o
            video. Troque por qualquer conteudo, blocos ou cards que voce queira
            desenvolver.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">Ideia 01</p>
              <p className="mt-2 text-base text-slate-600">
                Use este espaco para destacar um servico ou depoimento.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">Ideia 02</p>
              <p className="mt-2 text-base text-slate-600">
                Adicione cards com CTA e leve o usuario para outras paginas.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">Ideia 03</p>
              <p className="mt-2 text-base text-slate-600">
                Coloque uma galeria ou um formulario rapido de contato.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
