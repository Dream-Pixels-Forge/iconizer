import { useState } from 'react';
import { Image as ImageIcon, Settings, Info, Keyboard, Sparkles, Zap, Layers, Palette } from 'lucide-react';
import DropZone from './components/import/DropZone';
import SizeSelector from './components/configure/SizeSelector';
import FormatSelector from './components/configure/FormatSelector';
import PresetConfigurations from './components/configure/PresetConfigurations';
import OutputPanel from './components/output/OutputPanel';
import SettingsPanel from './components/settings/SettingsPanel';
import ShortcutsHelp from './components/settings/ShortcutsHelp';
import ThemeToggle from './components/ui/ThemeToggle';

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showShortcutHelp, setShowShortcutHelp] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative p-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                  <ImageIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Iconizer
                </h1>
                <p className="text-xs text-slate-400">v1.0.0-mvp</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowShortcutHelp(!showShortcutHelp)}
                className="p-2.5 rounded-xl glass-light hover:bg-white/10 transition-all duration-300 group"
                aria-label="Keyboard shortcuts"
                title="Keyboard shortcuts (?)"
              >
                <Keyboard className="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" />
              </button>

              <button
                onClick={() => setShowAbout(true)}
                className="p-2.5 rounded-xl glass-light hover:bg-white/10 transition-all duration-300 group"
                aria-label="About"
              >
                <Info className="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" />
              </button>

              <button
                onClick={() => setShowSettings(true)}
                className="p-2.5 rounded-xl glass-light hover:bg-white/10 transition-all duration-300 group"
                aria-label="Settings"
              >
                <Settings className="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" />
              </button>

              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light mb-4">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-slate-300">Professional Image Conversion Tool</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Convert Images
            </span>
            <br />
            <span className="text-white">at Lightning Speed</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Batch convert between formats and generate multiple sizes in one operation
          </p>
        </div>

        {/* Feature badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-light">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-slate-300">Fast Processing</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-light">
            <Layers className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-slate-300">Batch Conversion</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-light">
            <Palette className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-slate-300">10+ Formats</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 pb-12">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Import */}
          <div className="space-y-6 lg:col-span-1">
            <section aria-labelledby="import-heading" className="card-modern p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                  <ImageIcon className="h-5 w-5 text-white" />
                </div>
                <h2 id="import-heading" className="text-xl font-semibold text-white">
                  Import Images
                </h2>
              </div>
              <DropZone />
            </section>
          </div>

          {/* Middle Column - Configuration */}
          <div className="space-y-6 lg:col-span-1">
            <section aria-labelledby="sizes-heading" className="card-modern p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <Layers className="h-5 w-5 text-white" />
                </div>
                <h2 id="sizes-heading" className="text-xl font-semibold text-white">
                  Select Sizes
                </h2>
              </div>
              <SizeSelector />
            </section>

            <section aria-labelledby="formats-heading" className="card-modern p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
                  <Palette className="h-5 w-5 text-white" />
                </div>
                <h2 id="formats-heading" className="text-xl font-semibold text-white">
                  Select Formats
                </h2>
              </div>
              <FormatSelector />
            </section>

            <section aria-labelledby="presets-heading" className="card-modern p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <h2 id="presets-heading" className="text-xl font-semibold text-white">
                  Custom Presets
                </h2>
              </div>
              <PresetConfigurations />
            </section>
          </div>

          {/* Right Column - Output */}
          <div className="space-y-6 lg:col-span-1">
            <section aria-labelledby="output-heading" className="card-modern p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <h2 id="output-heading" className="text-xl font-semibold text-white">
                  Output
                </h2>
              </div>
              <OutputPanel />
            </section>
          </div>
        </div>
      </main>

      {/* Settings Panel */}
      {showSettings && (
        <SettingsPanel onClose={() => setShowSettings(false)} showAbout={showAbout} />
      )}

      {/* Keyboard Shortcuts Help */}
      {showShortcutHelp && (
        <ShortcutsHelp onClose={() => setShowShortcutHelp(false)} />
      )}

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 mt-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-400">
              Built with{' '}
              <span className="text-red-400">❤️</span>
              {' '}by Dream Pixels Forge
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Tauri v2</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span>React 18</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                <span>TypeScript</span>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
