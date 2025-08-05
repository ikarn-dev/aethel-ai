"use client";

export default function DemoSection() {
  return (
    <section className="py-20 px-6 bg-teal-900/20">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          See Aethel AI in Action
        </h2>
        <p className="text-xl text-teal-200/80 mb-12 max-w-3xl mx-auto">
          Experience the power of our AI platform through interactive demonstrations
        </p>

        {/* Demo Video */}
        <div className="relative max-w-5xl mx-auto">
          <div className="relative bg-teal-500/10 backdrop-blur-md rounded-2xl p-4 shadow-2xl overflow-hidden" style={{ border: '2px solid rgba(20, 184, 166, 0.3)' }}>
            
            {/* Decorative dots */}
            <div className="absolute top-6 left-6 flex space-x-1 z-20">
              <div className="w-2 h-2 bg-teal-400 rounded-full opacity-60"></div>
              <div className="w-2 h-2 bg-teal-400 rounded-full opacity-40"></div>
              <div className="w-2 h-2 bg-teal-400 rounded-full opacity-20"></div>
            </div>
            <div className="absolute top-6 right-6 flex space-x-1 z-20">
              <div className="w-2 h-2 bg-teal-400 rounded-full opacity-20"></div>
              <div className="w-2 h-2 bg-teal-400 rounded-full opacity-40"></div>
              <div className="w-2 h-2 bg-teal-400 rounded-full opacity-60"></div>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-slate-900/20 backdrop-blur-sm z-10">
              <video
                autoPlay
                muted
                loop
                playsInline
                controls
                className="w-full h-auto rounded-xl"
                preload="auto"
              >
                <source src="/landing-page/demo-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Video description */}
          <div className="mt-6 text-center">
            <p className="text-teal-200/80 text-sm max-w-2xl mx-auto">
              Watch how Aethel AI simplifies blockchain analysis and agent management with its intuitive interface and powerful JuliaOS backend integration.
            </p>
          </div>
          

        </div>
      </div>
    </section>
  );
}