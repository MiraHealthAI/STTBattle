export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">STT</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">STT Battle</h1>
            </div>
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
  );
} 