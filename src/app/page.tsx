import WebSocketTest from '@/components/WebSocketTest';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">STT Battle</h1>
              <span className="ml-3 px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
                Beta
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Speech-to-Text Comparator
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              WebSocket Connection Test
            </h2>
            <p className="text-gray-600">
              Test the WebSocket connection between the frontend and backend server. 
              This is part of Milestone 1: UI Scaffolding & Backend Setup.
            </p>
          </div>
          
          <WebSocketTest />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500">
            STT Battle - Open Source Speech-to-Text Comparator
          </div>
        </div>
      </footer>
    </div>
  );
}
