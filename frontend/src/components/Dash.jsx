import React from "react";
import video from "../assets/workouts.gif";

function Dash() {
  return (
    <>
      <section class="pt-12 pb-12 sm:pb-16 lg:pt-8">
        <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div class="grid max-w-lg grid-cols-1 mx-auto lg:max-w-full lg:items-center lg:grid-cols-2 gap-y-12 lg:gap-x-16">
            <div>
              <div class="text-center lg:text-left">
                <h1 class="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl sm:leading-tight lg:leading-tight lg:text-6xl font-pj">
                  Get personalised dashboards
                </h1>
                <p class="mt-2 text-lg text-gray-600 sm:mt-8 font-inter">
                  monitor your growth and track your days with personalised dashboards
                </p>
              </div>
            </div>

            <div>
              <img
                src={video}
                alt="Local GIF"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Dash;
