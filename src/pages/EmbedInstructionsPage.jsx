import { useState } from 'react'

const SCRIPT_TAG = `<script src="https://your-frontend-domain.com/chatbot-widget.js"></script>`

export default function EmbedInstructionsPage() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(SCRIPT_TAG).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Embed Chatbot Widget</h1>
      <p className="text-gray-500 mb-8">
        Follow the steps below to add the Smart FAQ chatbot to any website.
      </p>

      {/* Steps */}
      <div className="space-y-6">
        {/* Step 1 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm">1</span>
            <h2 className="text-lg font-semibold text-gray-700">Copy the script tag</h2>
          </div>
          <div className="relative bg-gray-900 rounded-md px-4 py-4 font-mono text-sm text-green-400 overflow-x-auto">
            <pre>{SCRIPT_TAG}</pre>
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs px-3 py-1 rounded transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm">2</span>
            <h2 className="text-lg font-semibold text-gray-700">Paste before the closing &lt;/body&gt; tag</h2>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            Open the HTML file of the page where you want the chatbot to appear. Paste the script tag
            just before the <code className="bg-gray-100 px-1 py-0.5 rounded text-red-600">&lt;/body&gt;</code> closing
            tag to ensure the DOM is ready when the widget loads.
          </p>
          <div className="mt-4 bg-gray-900 rounded-md px-4 py-4 font-mono text-sm text-gray-300 overflow-x-auto">
            <pre>{`  <!-- your page content -->

  <script src="https://your-frontend-domain.com/chatbot-widget.js"></script>
</body>`}</pre>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm">3</span>
            <h2 className="text-lg font-semibold text-gray-700">Chatbot appears in the bottom-right corner</h2>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            Once the script is included, a chat bubble will appear in the <strong>bottom-right corner</strong> of
            your page. Visitors can click it to open the FAQ assistant and get instant answers.
          </p>
          <div className="mt-4 flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-md p-4">
            <span className="text-3xl">💬</span>
            <p className="text-blue-700 text-sm">
              No additional configuration required — the widget is self-contained and ready to use.
            </p>
          </div>
        </div>
      </div>

      {/* Build note */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-5">
        <h3 className="font-semibold text-yellow-800 mb-1">Building the widget</h3>
        <p className="text-yellow-700 text-sm mb-3">
          Run the following command to generate <code className="bg-yellow-100 px-1 rounded">chatbot-widget.js</code> in the{' '}
          <code className="bg-yellow-100 px-1 rounded">dist-widget/</code> directory, then host it on your CDN or server:
        </p>
        <div className="bg-gray-900 rounded-md px-4 py-3 font-mono text-sm text-green-400">
          npm run build:widget
        </div>
      </div>
    </div>
  )
}
