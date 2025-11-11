import { motion } from 'framer-motion';

export default function About() {
  return (
    <section className="py-20 bg-dark-secondary" id="about">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">Sahayak-AI</span>
            </h2>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Sahayak-AI is an innovative adaptive learning platform that bridges the gap between traditional education and modern technology. Our mission is to empower educators with intelligent tools while providing students with personalized learning experiences.
            </p>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Built on cutting-edge AI, we analyze learning patterns, identify knowledge gaps, and create customized pathways ensuring every student reaches their full potential.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <motion.div
                className="bg-dark-tertiary border border-gray-800 rounded-lg p-6 text-center"
                whileHover={{ borderColor: "#00d4aa", scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-4xl font-bold bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent mb-2">50K+</div>
                <div className="text-sm text-gray-400">Active Students</div>
              </motion.div>
              <motion.div
                className="bg-dark-tertiary border border-gray-800 rounded-lg p-6 text-center"
                whileHover={{ borderColor: "#00d4aa", scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-4xl font-bold bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent mb-2">2K+</div>
                <div className="text-sm text-gray-400">Educators</div>
              </motion.div>
              <motion.div
                className="bg-dark-tertiary border border-gray-800 rounded-lg p-6 text-center"
                whileHover={{ borderColor: "#00d4aa", scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-4xl font-bold bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent mb-2">95%</div>
                <div className="text-sm text-gray-400">Success Rate</div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="relative h-96 flex items-center justify-center"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Background Glow Effects */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-accent/15 via-accent-light/10 to-transparent rounded-full blur-3xl"
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.6, 0.4], rotate: [0, 180, 360] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Feature Cards Container */}
            <div className="relative w-full max-w-sm space-y-5">
              {/* Card 1 - Smart Learning */}
              <motion.div
                className="bg-gradient-to-br from-dark-tertiary via-dark-secondary to-dark-tertiary backdrop-blur-md border border-gray-800/50 rounded-2xl p-6 shadow-2xl shadow-accent/5 hover:shadow-accent/20 transition-all duration-300 group"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                whileHover={{
                  scale: 1.03,
                  borderColor: "#00d4aa",
                  boxShadow: "0 20px 40px rgba(0, 212, 170, 0.2)"
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-accent/20 rounded-xl blur-md group-hover:blur-lg transition-all"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-accent via-accent-light to-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/30">
                      <svg className="w-8 h-8 text-dark-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-accent transition-colors">Smart Learning</h3>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">AI-Powered Personalization</p>
                  </div>
                </div>
              </motion.div>

              {/* Card 2 - Analytics */}
              <motion.div
                className="bg-gradient-to-br from-dark-tertiary via-dark-secondary to-dark-tertiary backdrop-blur-md border border-gray-800/50 rounded-2xl p-6 shadow-2xl shadow-accent/5 hover:shadow-accent/20 transition-all duration-300 group"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                whileHover={{
                  scale: 1.03,
                  borderColor: "#00d4aa",
                  boxShadow: "0 20px 40px rgba(0, 212, 170, 0.2)"
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-accent/20 rounded-xl blur-md group-hover:blur-lg transition-all"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-accent via-accent-light to-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/30">
                      <svg className="w-8 h-8 text-dark-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-accent transition-colors">Analytics</h3>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Real-time Insights</p>
                  </div>
                </div>
              </motion.div>

              {/* Card 3 - Progress */}
              <motion.div
                className="bg-gradient-to-br from-dark-tertiary via-dark-secondary to-dark-tertiary backdrop-blur-md border border-gray-800/50 rounded-2xl p-6 shadow-2xl shadow-accent/5 hover:shadow-accent/20 transition-all duration-300 group"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
                whileHover={{
                  scale: 1.03,
                  borderColor: "#00d4aa",
                  boxShadow: "0 20px 40px rgba(0, 212, 170, 0.2)"
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-accent/20 rounded-xl blur-md group-hover:blur-lg transition-all"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-accent via-accent-light to-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/30">
                      <svg className="w-8 h-8 text-dark-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-accent transition-colors">Progress</h3>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Accelerated Growth</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}