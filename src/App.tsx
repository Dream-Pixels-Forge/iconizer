import { useState } from 'react';
import { Moon, Sun, Image as ImageIcon, Settings, Info } from 'lucide-react';
import DropZone from './components/import/DropZone';
import SizeSelector from './components/configure/SizeSelector';
import FormatSelector from './components/configure/FormatSelector';
import PresetConfigurations from './components/configure/PresetConfigurations';
import OutputPanel from './components/output/OutputPanel';
import SettingsPanel from './components/settings/SettingsPanel';
import { useTheme } from './hooks/useTheme';

function App() {
  const { theme, setTheme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-semibold">Iconizer</h1>
            <span className="ml-2 text-xs text-muted-foreground">v1.0.0-mvp</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <button
              onClick={() => setShowAbout(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              aria-label="About"
            >
              <Info className="h-5 w-5" />
            </button>

            <button
              onClick={() => setShowSettings(true)}
              className="inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Import & Preview */}
          <div className="space-y-6 lg:col-span-1">
            <section aria-labelledby="import-heading">
              <h2 id="import-heading" className="mb-4 text-lg font-semibold">
                Import Images
              </h2>
              <DropZone />
            </section>
          </div>

          {/* Middle Column - Configuration */}
          <div className="space-y-6 lg:col-span-1">
            <section aria-labelledby="sizes-heading">
              <h2 id="sizes-heading" className="mb-4 text-lg font-semibold">
                Select Sizes
              </h2>
              <SizeSelector />
            </section>

            <section aria-labelledby="formats-heading">
              <h2 id="formats-heading" className="mb-4 text-lg font-semibold">
                Select Formats
              </h2>
              <FormatSelector />
            </section>

            <section aria-labelledby="presets-heading">
              <h2 id="presets-heading" className="mb-4 text-lg font-semibold">
                Custom Presets
              </h2>
              <PresetConfigurations />
            </section>
          </div>

          {/* Right Column - Output */}
          <div className="space-y-6 lg:col-span-1">
            <section aria-labelledby="output-heading">
              <h2 id="output-heading" className="mb-4 text-lg font-semibold">
                Output
              </h2>
              <OutputPanel />
            </section>
          </div>
        </div>
      </main>

      {/* Settings Panel */}
      {showSettings && (
        <SettingsPanel onClose={() => setShowSettings(false)} showAbout={showAbout} />
      )}

      {/* Footer */}
      <footer className="mt-auto border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            Built with Tauri, React, and Sharp
          </p>
          <p className="text-center text-sm text-muted-foreground">© 2026 Dream Pixels Forge</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
