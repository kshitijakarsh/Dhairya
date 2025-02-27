import React from "react";
import mobile from "../assets/mobile.svg";
import owner from "../assets/gym_owner.jpg"
import customer from "../assets/gym_freak.jpg"
import trainer from "../assets/trainer.jpg"

function MidSec() {
  return (
    <>
      <section class="mb-20 bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div class="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div class="grid max-w-md grid-cols-1 mx-auto lg:grid-cols-12 gap-x-6 gap-y-8 lg:max-w-none">
            <div class="self-center lg:col-span-4">
              <h1 class="text-3xl font-bold text-gray-900 sm:text-4xl xl:text-5xl">
                A platform for everyone
              </h1>
              <div class="relative inline-flex mt-9 group">
                
                <a
                  href="#"
                  title=""
                  class="relative inline-flex items-center justify-center px-8 py-3 sm:text-sm sm:py-3.5 text-base text-white transition-all duration-200 bg-slate-950 border border-transparent rounded-lg hover:bg-slate-950 focus:outline-none"
                  role="button"
                >
                  Join Us
                </a>
              </div>
            </div>

            <div class="self-end lg:order-last lg:pb-20 lg:col-span-3">
              <div class="mt-6 space-y-6 lg:space-y-8">
                <div class="relative overflow-hidden">
                  <div class="flex items-start lg:items-center">
                    <img
                      class="object-cover w-12 h-12 rounded-lg shrink-0"
                      src={owner}
                      alt=""
                    />
                    <p class="ml-5 text-base font-bold leading-6 text-gray-900">
                      <a href="#" title="">
                        For Gym Owners
                        <span
                          class="absolute inset-0"
                          aria-hidden="true"
                        ></span>
                      </a>
                    </p>
                  </div>
                </div>

                <div class="relative overflow-hidden">
                  <div class="flex items-start lg:items-center">
                    <img
                      class="object-cover w-12 h-12 rounded-lg shrink-0"
                      src={customer}
                      alt=""
                    />
                    <p class="ml-5 text-base font-bold leading-6 text-gray-900">
                      <a href="#" title="">
                        For Gym Freaks
                        <span
                          class="absolute inset-0"
                          aria-hidden="true"
                        ></span>
                      </a>
                    </p>
                  </div>
                </div>

                <div class="relative overflow-hidden">
                  <div class="flex items-start lg:items-center">
                    <img
                      class="object-cover w-12 h-12 rounded-lg shrink-0"
                      src={trainer}
                      alt=""
                    />
                    <p class="ml-5 text-base font-bold leading-6 text-gray-900">
                      <a href="#" title="">
                        For Trainers
                        <span
                          class="absolute inset-0"
                          aria-hidden="true"
                        ></span>
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="self-end lg:col-span-5">
              <img class="w-full mx-auto" src={mobile} alt="" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default MidSec;
