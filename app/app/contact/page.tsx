export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-teal-400 mb-3">
            Contact
          </h1>
          <p className="text-slate-400 text-sm">
            Get in touch for questions, feedback, or support
          </p>
        </div>

        {/* X (Twitter) Contact Card */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 text-center">
          <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </div>
          
          <h2 className="text-lg font-semibold text-white mb-2">Follow on X</h2>
          <p className="text-slate-400 text-sm mb-6">
            Connect with me for updates and discussions
          </p>

          <a
            href="https://x.com/iKK6600"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span>@iKK6600</span>
          </a>

          <p className="text-xs text-slate-500 mt-4">
            Feel free to reach out with questions or feedback!
          </p>
        </div>
      </div>
    </div>
  );
}