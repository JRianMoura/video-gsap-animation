"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect } from "react";

export default function Home() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const videoEl = document.querySelector("#video");
    const container = document.querySelector("#video-section");

    if (!videoEl || !container) {
      return undefined;
    }

    let scrollTriggerInstance;
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

      const distancePerSecond = 320;
      const getScrollDistance = () =>
        Math.max(
          window.innerHeight * 1.6,
          videoEl.duration * distancePerSecond
        );

      scrollTriggerInstance?.kill();

      scrollTriggerInstance = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: () => `+=${getScrollDistance()}`,
        scrub: 0.7,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => updateCurrentTime(self.progress),
        onLeave: () => updateCurrentTime(1),
        onLeaveBack: () => updateCurrentTime(0),
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
      window.removeEventListener("resize", handleResize);
      videoEl.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  return (
    <main className="bg-white text-gray-900">
      <section className="relative min-h-screen">
        <div
          id="video-section"
          className="relative h-screen w-full overflow-hidden"
        >
          <video
            className="video-bg absolute inset-0 h-full w-full object-cover"
            src="video/praia.mp4"
            muted
            preload="auto"
            playsInline
            id="video"
          />
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
