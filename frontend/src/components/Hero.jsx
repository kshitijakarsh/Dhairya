import React from "react";
import hero from "../assets/hero.svg"

function Hero() {
  return (
    <>
      <section class="relative py-10 sm:py-10 lg:pb-20 lg:h-auto">
        <div class="absolute bottom-0 right-0 overflow-hidden">
          <img
            class="w-full h-auto origin-right transform scale-50 lg:w-auto lg:h-120 lg:mx-auto lg:object-cover lg:scale-100"
            src="https://cdn.rareblocks.xyz/collection/clarity/images/hero/1/background-pattern.png"
            alt=""
          />
        </div>

        <div class="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 gap-y-4 lg:items-center lg:grid-cols-2 xl:grid-cols-2">
            <div class="text-center xl:col-span-1 lg:text-left md:px-16 lg:px-0 xl:pr-20">
              <h1 class="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-tight font-pj">
                A place to grow stronger and fitter.
              </h1>
              <p class="mt-2 text-lg text-gray-600 sm:mt-6 font-inter">
                Train hard, stay consistent, and push beyond limits. Strength
                grows with discipline, and fitness fuels confidence, energy, and
                resilience.
              </p>

              <a
                href="#"
                title=""
                class="inline-flex px-8 py-4 mt-8 text-lg text-white transition-all duration-200 bg-slate-950 border border-transparent rounded-lg hover:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                role="button"
              >
                Let's Go
              </a>
            </div>

            <div class="xl:col-span-1">
              <img
                class="w-full mx-auto"
                src={hero}
                alt=""
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero;
