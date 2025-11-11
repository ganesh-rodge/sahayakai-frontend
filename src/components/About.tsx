import { motion } from 'framer-motion';

export default function About() {
  const themeColor = '#00d4aa';

  const statsCardBase =
    'rounded-2xl p-5 text-center border border-white/6 ring-1 ring-white/3 bg-transparent backdrop-blur-sm shadow-[inset_0_6px_12px_rgba(0,0,0,0.6)] transition-transform duration-300';

  const featureCardBase =
    'group relative overflow-hidden rounded-2xl w-36 h-36 md:w-40 md:h-40 border border-white/6 ring-1 ring-white/3 backdrop-blur-xl bg-[rgba(255,255,255,0.02)] shadow-[0_10px_30px_rgba(0,0,0,0.6)] transform-gpu will-change-transform flex flex-col items-center justify-center';

  // Circular orbit animation - cards move in a perfect circle with larger radius
  const getCircularOrbit = (index: number, total = 3, radius = 130): any => {
    // Calculate angle for each card to position them in a circle
    const angleOffset = (Math.PI * 2) / total;
    const startAngle = index * angleOffset - Math.PI / 2; // Start from top

    return {
      x: [
        Math.cos(startAngle) * radius,
        Math.cos(startAngle + Math.PI * 0.5) * radius,
        Math.cos(startAngle + Math.PI) * radius,
        Math.cos(startAngle + Math.PI * 1.5) * radius,
        Math.cos(startAngle + Math.PI * 2) * radius,
      ],
      y: [
        Math.sin(startAngle) * radius,
        Math.sin(startAngle + Math.PI * 0.5) * radius,
        Math.sin(startAngle + Math.PI) * radius,
        Math.sin(startAngle + Math.PI * 1.5) * radius,
        Math.sin(startAngle + Math.PI * 2) * radius,
      ],
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "linear",
      },
    };
  };

  const features = [
    {
      icon: (
        <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "Smart Learning"
    },
    {
      icon: (
        <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Analytics"
    },
    {
      icon: (
        <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      title: "Progress"
    }
  ];

  return (
    <section
      id="about"
      className="relative py-20"
      style={{ background: 'linear-gradient(180deg,#031018 0%, #05060a 100%)' }}
    >
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-80 w-[900px] rounded-full blur-3xl opacity-30" style={{ background: `radial-gradient(ellipse at center, ${themeColor}22, transparent 60%)` }} />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left: content + stats */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              About{' '}
              <span className="text-accent" style={{ color: themeColor }}>Sahayak-AI</span>
            </h2>

            <p className="mb-4 leading-relaxed" style={{ color: '#B0B8C1' }}>
              Sahayak-AI is an adaptive learning platform that blends modern AI with educator-first
              tools to deliver personalized learning pathways. We analyze progress, identify gaps,
              and generate tailored content so students advance confidently.
            </p>

            <p className="mb-8 leading-relaxed" style={{ color: '#B0B8C1' }}>
              Our tools help teachers scale quality instruction while giving learners the feedback
              and structure they need to succeed.
            </p>

            <div className="flex gap-4 flex-col sm:flex-row sm:items-stretch">
              <motion.div
                className={`${statsCardBase} flex-1`}
                whileHover={{ y: -6, scale: 1.02 }}
                style={{ boxShadow: 'inset 0 6px 18px rgba(0,0,0,0.6), 0 10px 30px rgba(0,0,0,0.5)' }}
              >
                <div className="text-4xl md:text-5xl font-bold mb-1" style={{ color: themeColor, textShadow: `0 8px 28px ${themeColor}22` }}>50K+</div>
                <div className="text-sm text-gray-400">Active Students</div>
              </motion.div>

              <motion.div className={`${statsCardBase} flex-1`} whileHover={{ y: -6, scale: 1.02 }} style={{ boxShadow: 'inset 0 6px 18px rgba(0,0,0,0.6), 0 10px 30px rgba(0,0,0,0.5)' }}>
                <div className="text-4xl md:text-5xl font-bold mb-1" style={{ color: themeColor, textShadow: `0 8px 28px ${themeColor}22` }}>2K+</div>
                <div className="text-sm text-gray-400">Educators</div>
              </motion.div>

              <motion.div className={`${statsCardBase} flex-1`} whileHover={{ y: -6, scale: 1.02 }} style={{ boxShadow: 'inset 0 6px 18px rgba(0,0,0,0.6), 0 10px 30px rgba(0,0,0,0.5)' }}>
                <div className="text-4xl md:text-5xl font-bold mb-1" style={{ color: themeColor, textShadow: `0 8px 28px ${themeColor}22` }}>95%</div>
                <div className="text-sm text-gray-400">Success Rate</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: circular floating feature cards */}
          <motion.div
            className="relative h-96 flex items-center justify-center"
            style={{ marginTop: '-1cm' }}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Rotating glow */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl"
              style={{ background: `radial-gradient(circle at center, ${themeColor}20, transparent)` }}
              animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.6, 0.35], rotate: [0, 180, 360] }}
              transition={{ duration: 14, repeat: Infinity }}
            />

            {/* Circular orbit container */}
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Mobile stacked fallback */}
              <div className="flex flex-col gap-4 sm:hidden">
                {features.map((feature, index: number) => (
                  <div key={index} className={featureCardBase} style={{ boxShadow: `0 8px 25px rgba(0,255,180,0.06)` }}>
                    <div className="relative mb-3">
                      <div className="relative w-12 h-12 grid place-items-center rounded-xl" style={{ background: `${themeColor}22`, boxShadow: `0 6px 18px ${themeColor}22, inset 0 4px 12px rgba(0,0,0,0.45)` }}>
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="text-sm font-semibold text-white tracking-wide">{feature.title}</h3>
                  </div>
                ))}
              </div>

              {/* Desktop circular orbit */}
              <div className="hidden sm:block relative w-full h-full">
                {features.map((feature, index: number) => (
                  <motion.div
                    key={index}
                    className="absolute top-1/2 left-1/2"
                    style={{
                      x: '-50%',
                      y: '-50%',
                    }}
                    animate={getCircularOrbit(index, features.length, 130) as any}
                  >
                    <motion.div
                      className={featureCardBase}
                      whileHover={{
                        scale: 1.1,
                        y: -8,
                        boxShadow: `0 12px 40px rgba(0,245,160,0.18), 0 8px 25px rgba(0,255,180,0.2)`
                      }}
                      transition={{ duration: 0.3 }}
                      style={{ boxShadow: '0 8px 25px rgba(0,255,180,0.06)' }}
                    >
                      <div className="relative mb-3">
                        <div
                          className="relative w-14 h-14 grid place-items-center rounded-xl transition-transform duration-300 group-hover:scale-105"
                          style={{
                            background: `${themeColor}22`,
                            boxShadow: `0 6px 18px ${themeColor}22, inset 0 4px 12px rgba(0,0,0,0.45)`
                          }}
                        >
                          {feature.icon}
                        </div>
                      </div>
                      <h3 className="text-sm font-semibold text-white tracking-wide">{feature.title}</h3>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}