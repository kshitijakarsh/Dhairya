import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function Dash() {
  const { user } = useAuth();

  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="relative mx-auto w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[400px] lg:max-w-[480px] transform-gpu">
              <div className="relative pt-12 xs:pt-16 sm:pt-20 lg:pt-24">
                <div className="relative translate-x-4 xs:translate-x-6 sm:translate-x-8 lg:translate-x-12 scale-90 sm:scale-95 lg:scale-100 transform-gpu">
                  <div className="relative aspect-[16/10] rounded-2xl bg-black/95 p-1 xs:p-1.5 shadow-[0_8px_16px_rgb(0_0_0/0.2)] ring-1 ring-white/20">
                    <div className="h-full w-full overflow-hidden rounded-xl bg-white/95">
                      <div className="h-full bg-white p-2 xs:p-3 sm:p-4">
                        <div className="space-y-3 xs:space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="h-1.5 xs:h-2 w-16 xs:w-20 rounded-full bg-gray-200 animate-pulse"></div>
                              <div className="h-1 xs:h-1.5 w-20 xs:w-24 rounded-full bg-gray-100"></div>
                            </div>
                            <div className="flex space-x-1.5 xs:space-x-2">
                              <div className="h-4 xs:h-5 w-4 xs:w-5 rounded-full bg-gray-200"></div>
                              <div className="h-4 xs:h-5 w-4 xs:w-5 rounded-full bg-gray-200"></div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-1.5 xs:gap-2">
                            {[1, 2, 3].map((_, i) => (
                              <div key={i} className="h-12 xs:h-14 sm:h-16 rounded-xl bg-gray-50/80 p-1.5 xs:p-2">
                                <div className="space-y-1">
                                  <div className="h-1 xs:h-1.5 w-6 xs:w-8 rounded-full bg-gray-200"></div>
                                  <div className="h-2 xs:h-3 w-8 xs:w-10 rounded-full bg-gray-200 animate-pulse"></div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="rounded-xl bg-gray-50/80 p-2 xs:p-3">
                            <div className="flex items-end h-16 xs:h-20 gap-1 xs:gap-1.5">
                              {[65, 40, 85, 55, 95, 70].map((height, i) => (
                                <div
                                  key={i}
                                  className="flex-1 bg-gray-200 rounded-full animate-pulse"
                                  style={{ height: `${height}%`, animationDelay: `${i * 100}ms` }}
                                ></div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-1.5 xs:space-y-2">
                            <div className="h-1.5 xs:h-2 w-full rounded-full bg-gray-100"></div>
                            <div className="h-1.5 xs:h-2 w-[85%] rounded-full bg-gray-100"></div>
                            <div className="h-1.5 xs:h-2 w-[70%] rounded-full bg-gray-100"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative mx-auto">
                    <div className="absolute left-1/2 top-0 h-[2px] w-24 xs:w-28 -translate-x-1/2 bg-black/20"></div>
                    <div className="absolute left-1/2 h-4 xs:h-5 w-20 xs:w-24 -translate-x-1/2 rounded-b-xl bg-black/95 ring-1 ring-white/20"></div>
                  </div>
                </div>

                <div className="absolute -top-4 xs:-top-8 sm:-top-12 left-0 xs:-left-2 sm:-left-4 w-[140px] xs:w-[160px] sm:w-[180px] lg:w-[200px] transform-gpu z-10">
                  <div className="relative aspect-[9/19] rounded-[2rem] bg-black/95 p-1 xs:p-1.5 shadow-[0_8px_24px_rgb(0_0_0/0.25)] ring-1 ring-white/20">
                    <div className="absolute top-2 xs:top-2.5 left-1/2 h-1.5 xs:h-2 w-12 xs:w-16 -translate-x-1/2 rounded-full bg-black/80"></div>
                    <div className="h-full w-full overflow-hidden rounded-[1.75rem] bg-white/95">
                      <div className="h-full p-2 xs:p-3 space-y-2 xs:space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="h-1.5 xs:h-2 w-8 xs:w-10 rounded-full bg-gray-200"></div>
                          <div className="h-3 xs:h-4 w-3 xs:w-4 rounded-full bg-gray-200"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 xs:gap-2">
                          {[1, 2].map((_, i) => (
                            <div key={i} className="h-10 xs:h-12 rounded-xl bg-gray-50/80 p-1.5">
                              <div className="space-y-1">
                                <div className="h-1 xs:h-1.5 w-5 xs:w-6 rounded-full bg-gray-200"></div>
                                <div className="h-1.5 xs:h-2 w-7 xs:w-8 rounded-full bg-gray-200"></div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="rounded-xl bg-gray-50/80 p-1.5">
                          <div className="flex items-end h-12 xs:h-14 gap-1">
                            {[75, 45, 90, 60, 85].map((height, i) => (
                              <div
                                key={i}
                                className="flex-1 bg-gray-200 rounded-full"
                                style={{ height: `${height}%` }}
                              ></div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1 xs:space-y-1.5">
                          <div className="h-1 xs:h-1.5 w-full rounded-full bg-gray-100"></div>
                          <div className="h-1 xs:h-1.5 w-[80%] rounded-full bg-gray-100"></div>
                          <div className="h-1 xs:h-1.5 w-[60%] rounded-full bg-gray-100"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-8 -right-8 xs:-top-12 xs:-right-12 w-32 xs:w-40 h-32 xs:h-40 bg-gray-100/50 rounded-full blur-3xl" />
              <div className="absolute -bottom-6 -left-6 xs:-bottom-8 xs:-left-8 w-24 xs:w-32 h-24 xs:h-32 bg-gray-100/50 rounded-full blur-3xl" />
            </div>
          </div>

          <div className="order-1 lg:order-2 max-w-xl mx-auto lg:mx-0">
            <h2 className="text-4xl font-bold mb-6">
              Powerful Dashboard for{" "}
              <span className="gradient-text">Every User</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Our intuitive dashboard provides gym owners with comprehensive management tools,
              trainers with client tracking capabilities, and members with progress monitoring features.
              Everything you need to succeed in one place.
            </p>

          </div>
        </div>
      </div>
    </section>
  );
}

export default Dash;
