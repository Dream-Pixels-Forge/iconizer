import { useState } from 'react';
import {
  Image as ImageIcon,
  Settings,
  Info,
  Keyboard,
  Sparkles,
  Zap,
  Layers,
  Palette,
} from 'lucide-react';
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
    <div className="skeuo-scrollbar relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Subtle background texture */}
      <div className="pointer-events-none fixed inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            opacity: 0.03,
          }}
        />
      </div>

      {/* Header */}
      <header className="surface-raised sticky top-0 z-50 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-6">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <div className="group flex cursor-pointer items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 opacity-40 blur-md transition-opacity group-hover:opacity-60" />
                <div className="relative rounded-xl border-t border-teal-400/30 bg-gradient-to-b from-teal-500 to-emerald-600 p-2.5 shadow-lg">
                  <ImageIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800 dark:text-white">Iconizer</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">v1.0.0-mvp</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowShortcutHelp(!showShortcutHelp)}
                className="skeuo-icon-btn text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white"
                aria-label="Keyboard shortcuts"
                title="Keyboard shortcuts (?)"
              >
                <Keyboard className="h-5 w-5" />
              </button>

              <button
                onClick={() => setShowAbout(true)}
                className="skeuo-icon-btn text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white"
                aria-label="About"
              >
                <Info className="h-5 w-5" />
              </button>

              <button
                onClick={() => setShowSettings(true)}
                className="skeuo-icon-btn text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white"
                aria-label="Settings"
              >
                <Settings className="h-5 w-5" />
              </button>

              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container relative z-10 mx-auto px-6 py-8">
        <div className="mb-8 text-center">
          <div className="surface-embossed mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span className="text-sm text-slate-600 dark:text-slate-300">
              Professional Image Conversion Tool
            </span>
          </div>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            <span className="text-slate-800 dark:text-white">Convert Images</span>
            <br />
            <span className="text-teal-600 dark:text-teal-400">at Lightning Speed</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-500 dark:text-slate-400">
            Batch convert between formats and generate multiple sizes in one operation
          </p>
        </div>

        {/* Feature badges */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          <div className="surface-embossed flex items-center gap-2 rounded-full px-4 py-2">
            <Zap className="h-4 w-4 text-amber-500" />
            <span className="text-sm text-slate-600 dark:text-slate-300">Fast Processing</span>
          </div>
          <div className="surface-embossed flex items-center gap-2 rounded-full px-4 py-2">
            <Layers className="h-4 w-4 text-teal-500" />
            <span className="text-sm text-slate-600 dark:text-slate-300">Batch Conversion</span>
          </div>
          <div className="surface-embossed flex items-center gap-2 rounded-full px-4 py-2">
            <Palette className="h-4 w-4 text-purple-500" />
            <span className="text-sm text-slate-600 dark:text-slate-300">10+ Formats</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container relative z-10 mx-auto px-6 pb-12">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Import */}
          <div className="space-y-6 lg:col-span-1">
            <section aria-labelledby="import-heading" className="skeuo-card p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg border-t border-teal-400/30 bg-gradient-to-b from-teal-500 to-teal-600 p-2 shadow-md">
                  <ImageIcon className="h-5 w-5 text-white" />
                </div>
                <h2
                  id="import-heading"
                  className="text-xl font-semibold text-slate-800 dark:text-white"
                >
                  Import Images
                </h2>
              </div>
              <DropZone />
            </section>
          </div>

          {/* Middle Column - Configuration */}
          <div className="space-y-6 lg:col-span-1">
            <section aria-labelledby="sizes-heading" className="skeuo-card p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg border-t border-purple-400/30 bg-gradient-to-b from-purple-500 to-pink-500 p-2 shadow-md">
                  <Layers className="h-5 w-5 text-white" />
                </div>
                <h2
                  id="sizes-heading"
                  className="text-xl font-semibold text-slate-800 dark:text-white"
                >
                  Select Sizes
                </h2>
              </div>
              <SizeSelector />
            </section>

            <section aria-labelledby="formats-heading" className="skeuo-card p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg border-t border-cyan-400/30 bg-gradient-to-b from-cyan-500 to-blue-500 p-2 shadow-md">
                  <Palette className="h-5 w-5 text-white" />
                </div>
                <h2
                  id="formats-heading"
                  className="text-xl font-semibold text-slate-800 dark:text-white"
                >
                  Select Formats
                </h2>
              </div>
              <FormatSelector />
            </section>

            <section aria-labelledby="presets-heading" className="skeuo-card p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg border-t border-amber-400/30 bg-gradient-to-b from-amber-500 to-orange-500 p-2 shadow-md">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <h2
                  id="presets-heading"
                  className="text-xl font-semibold text-slate-800 dark:text-white"
                >
                  Custom Presets
                </h2>
              </div>
              <PresetConfigurations />
            </section>
          </div>

          {/* Right Column - Output */}
          <div className="space-y-6 lg:col-span-1">
            <section aria-labelledby="output-heading" className="skeuo-card p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg border-t border-green-400/30 bg-gradient-to-b from-green-500 to-emerald-500 p-2 shadow-md">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <h2
                  id="output-heading"
                  className="text-xl font-semibold text-slate-800 dark:text-white"
                >
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
      {showShortcutHelp && <ShortcutsHelp onClose={() => setShowShortcutHelp(false)} />}

      {/* Footer */}
      <footer className="relative z-10 mt-12 border-t border-slate-200 py-8 dark:border-slate-700">
        <div className="surface-raised">
          <div className="container mx-auto px-6">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Built with <span className="text-red-500">❤️</span> by Dream Pixels Forge
              </p>
              <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                  <span>Tauri v2</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
                  <span>React 18</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-purple-500" />
                  <span>TypeScript</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
