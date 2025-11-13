// Icons are now served as images from /public/brands; inline SVG components removed.

export default function Community() {
  const channels = [
    {
      id: 'whatsapp',
      name: 'WhatsApp Channel',
      description: 'Join our official WhatsApp channel for bite-sized updates, community highlights, and quick links.',
      href: 'https://whatsapp.com/channel/0029VbBY7nD3mFXz0rtcnU3X',
      colorFrom: 'from-emerald-400',
      colorTo: 'to-teal-400',
      icon: '🟢'
    },
    {
      id: 'telegram',
      name: 'Telegram Channel',
      description: 'Follow our Telegram for deeper discussions, resources, and pinned announcements.',
      href: 'https://t.me/SahayakAI',
      colorFrom: 'from-sky-400',
      colorTo: 'to-indigo-500',
      icon: '✳️'
    }
  ];

  return (
    <div className="min-h-screen bg-dark-primary flex items-center">
      <div className="max-w-5xl mx-auto px-6 py-20 w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Join our <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">Community Channels</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">Stay updated and connected — pick a channel below to join our community conversations and resources.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {channels.map((c) => (
            <a
              key={c.id}
              href={c.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${c.name} (new tab)`}
              className={`block rounded-2xl p-6 sm:p-8 bg-dark-secondary border border-gray-800 hover:shadow-[0_18px_60px_rgba(0,212,170,0.07)] transition-all transform hover:-translate-y-1 ${c.id === 'whatsapp' ? 'hover:border-emerald-400' : 'hover:border-sky-400'}`}
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 h-14 w-14 rounded-lg grid place-items-center ring-1 ring-accent/20 ${c.id === 'whatsapp' ? 'bg-[#25D366]' : 'bg-[#229ED9]'}`}>
                  <img
                    src={c.id === 'whatsapp' ? '/brands/whatsapp.svg' : '/brands/telegram.svg'}
                    alt={`${c.name} logo`}
                    className="h-8 w-8 object-contain"
                    loading="lazy"
                    width="32"
                    height="32"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">{c.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{c.description}</p>
                  <div className="flex items-center gap-3">
                    <span
                      role="button"
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-dark-primary bg-gradient-to-r ${c.colorFrom} ${c.colorTo} shadow-[0_10px_30px_rgba(0,212,170,0.25)] hover:shadow-[0_18px_40px_rgba(0,212,170,0.4)]`}
                    >
                      Join <span aria-hidden>↗</span>
                    </span>
                    <span className="text-xs text-gray-500">Opens in new tab</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">By joining you agree to follow our community guidelines and keep conversations respectful.</div>
      </div>
    </div>
  );
}
