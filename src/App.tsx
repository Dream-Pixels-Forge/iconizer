import { useState, useEffect } from 'react';
import { Moon, Sun, Image as ImageIcon, Settings, Info } from 'lucide-react';
import DropZone from './components/import/DropZone';
import SizeSelector from './components/configure/SizeSelector';
import FormatSelector from './components/configure/FormatSelector';
import OutputPanel from './components/output/OutputPanel';
import SettingsPanel from './components/settings/SettingsPanel';
import { useTheme } from './hooks/useTheme';
import { cn } from './lib/utils';

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
            <span className="text-xs text-muted-foreground ml-2">v1.0.0-mvp</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            
            <button
              onClick={() => setShowAbout(true)}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9"
              aria-label="About"
            >
              <Info className="h-5 w-5" />
            </button>
            
            <button
              onClick={() => setShowSettings(true)}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 px-4"
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
          <div className="lg:col-span-1 space-y-6">
            <section aria-labelledby="import-heading">
              <h2 id="import-heading" className="text-lg font-semibold mb-4">
                Import Images
              </h2>
              <DropZone />
            </section>
          </div>

          {/* Middle Column - Configuration */}
          <div className="lg:col-span-1 space-y-6">
            <section aria-labelledby="sizes-heading">
              <h2 id="sizes-heading" className="text-lg font-semibold mb-4">
                Select Sizes
              </h2>
              <SizeSelector />
            </section>

            <section aria-labelledby="formats-heading">
              <h2 id="formats-heading" className="text-lg font-semibold mb-4">
                Select Formats
              </h2>
              <FormatSelector />
            </section>
          </div>

          {/* Right Column - Output */}
          <div className="lg:col-span-1 space-y-6">
            <section aria-labelledby="output-heading">
              <h2 id="output-heading" className="text-lg font-semibold mb-4">
                Output
              </h2>
              <OutputPanel />
            </section>
          </div>
        </div>
      </main>

      {/* Settings Panel */}
      {showSettings && (
        <SettingsPanel 
          onClose={() => setShowSettings(false)} 
          showAbout={showAbout}
          onAboutClose={() => setShowAbout(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t py-6 mt-auto">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            Built with Tauri, React, and Sharp
          </p>
          <p className="text-center text-sm text-muted-foreground">
            © 2026 Dream Pixels Forge
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
