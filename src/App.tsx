import { useState } from 'react';
import {
  Image as ImageIcon,
  Settings,
  Info,
  Keyboard,
  Layers,
  Palette,
  FolderOpen,
  ArrowRight,
  Check,
  Download,
  Zap,
} from 'lucide-react';
import DropZone from './components/import/DropZone';
import SizeSelector from './components/configure/SizeSelector';
import FormatSelector from './components/configure/FormatSelector';
import PresetConfigurations from './components/configure/PresetConfigurations';
import OutputPanel from './components/output/OutputPanel';
import SettingsPanel from './components/settings/SettingsPanel';
import ShortcutsHelp from './components/settings/ShortcutsHelp';
import ThemeToggle from './components/ui/ThemeToggle';
import { useImportStore } from './stores/importStore';
import { useConfigStore } from './stores/configStore';

type Step = 'import' | 'sizes' | 'formats' | 'output';

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showShortcutHelp, setShowShortcutHelp] = useState(false);
  const [activeStep, setActiveStep] = useState<Step>('import');

  const images = useImportStore((state) => state.images);
  const selectedSizes = useConfigStore((state) => state.selectedSizes);
  const selectedFormats = useConfigStore((state) => state.selectedFormats);

  const steps: { id: Step; label: string; icon: React.ReactNode }[] = [
    { id: 'import', label: 'Import', icon: <FolderOpen className="h-4 w-4" /> },
    { id: 'sizes', label: 'Sizes', icon: <Layers className="h-4 w-4" /> },
    { id: 'formats', label: 'Formats', icon: <Palette className="h-4 w-4" /> },
    { id: 'output', label: 'Output', icon: <Download className="h-4 w-4" /> },
  ];

  const getStepStatus = (step: Step) => {
    const stepIndex = steps.findIndex((s) => s.id === step);
    const currentIndex = steps.findIndex((s) => s.id === activeStep);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  const canProceed = () => {
    switch (activeStep) {
      case 'import':
        return images.length > 0;
      case 'sizes':
        return selectedSizes.length > 0;
      case 'formats':
        return selectedFormats.length > 0;
      case 'output':
        return true;
    }
  };

  const nextStep = () => {
    const currentIndex = steps.findIndex((s) => s.id === activeStep);
    if (currentIndex < steps.length - 1) {
      setActiveStep(steps[currentIndex + 1].id);
    }
  };

  const prevStep = () => {
    const currentIndex = steps.findIndex((s) => s.id === activeStep);
    if (currentIndex > 0) {
      setActiveStep(steps[currentIndex - 1].id);
    }
  };

  return (
    <div className="skeuo-scrollbar flex h-screen flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="surface-raised flex-none border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="group flex cursor-pointer items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 opacity-40 blur-md" />
                <div className="relative rounded-lg bg-gradient-to-b from-teal-500 to-emerald-600 p-2 shadow-md">
                  <ImageIcon className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800 dark:text-white">Iconizer</h1>
                <p className="text-xs text-slate-500">v1.0.0-mvp</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowShortcutHelp(!showShortcutHelp)}
                className="skeuo-icon-btn p-2 text-slate-600 dark:text-slate-300"
                aria-label="Keyboard shortcuts"
              >
                <Keyboard className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowAbout(true)}
                className="skeuo-icon-btn p-2 text-slate-600 dark:text-slate-300"
                aria-label="About"
              >
                <Info className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="skeuo-icon-btn p-2 text-slate-600 dark:text-slate-300"
                aria-label="Settings"
              >
                <Settings className="h-4 w-4" />
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="flex-none border-b border-slate-200 bg-white/50 dark:border-slate-700 dark:bg-slate-800/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-1">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => setActiveStep(step.id)}
                  className={`
                    flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-all duration-200
                    ${
                      getStepStatus(step.id) === 'active'
                        ? 'bg-gradient-to-b from-teal-500 to-teal-600 text-white shadow-md'
                        : getStepStatus(step.id) === 'completed'
                          ? 'bg-gradient-to-b from-green-500 to-green-600 text-white shadow-md'
                          : 'surface-embossed text-slate-500 dark:text-slate-400'
                    }
                  `}
                >
                  {getStepStatus(step.id) === 'completed' ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    step.icon
                  )}
                  <span className="hidden font-medium sm:inline">{step.label}</span>
                </button>
                {index < steps.length - 1 && <ArrowRight className="mx-2 h-4 w-4 text-slate-400" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <div className="container mx-auto h-full px-4">
          <div className="grid h-full grid-cols-12 gap-4 py-4">
            {/* Sidebar */}
            <div className="col-span-3 flex flex-col gap-3">
              <div className="skeuo-card p-4">
                <div className="mb-3 flex items-center gap-2">
                  <div className="rounded-lg bg-gradient-to-b from-teal-500 to-teal-600 p-1.5">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-white">Summary</h3>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Images</span>
                    <span className="font-medium">{images.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Sizes</span>
                    <span className="font-medium">{selectedSizes.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Formats</span>
                    <span className="font-medium">{selectedFormats.length}</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={prevStep}
                    disabled={activeStep === 'import'}
                    className="skeuo-btn-outline flex-1 py-1.5 text-xs disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={!canProceed() || activeStep === 'output'}
                    className="skeuo-btn flex flex-1 items-center justify-center gap-1 py-1.5 text-xs disabled:opacity-50"
                  >
                    Next
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {activeStep === 'sizes' && (
                <div className="skeuo-card flex-1 overflow-auto p-4">
                  <PresetConfigurations />
                </div>
              )}
            </div>

            {/* Main Panel */}
            <div className="col-span-9 overflow-auto">
              {activeStep === 'import' && (
                <div className="skeuo-card h-full p-6">
                  <DropZone />
                </div>
              )}

              {activeStep === 'sizes' && (
                <div className="skeuo-card p-6">
                  <SizeSelector />
                </div>
              )}

              {activeStep === 'formats' && (
                <div className="skeuo-card p-6">
                  <FormatSelector />
                </div>
              )}

              {activeStep === 'output' && (
                <div className="skeuo-card p-6">
                  <OutputPanel />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="surface-raised flex-none border-t border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                <span>Tauri v2</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                <span>React 18</span>
              </span>
            </div>
            <p>
              Built with <span className="text-red-500">❤</span> by Dream Pixels Forge
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showSettings && (
        <SettingsPanel onClose={() => setShowSettings(false)} showAbout={showAbout} />
      )}
      {showShortcutHelp && <ShortcutsHelp onClose={() => setShowShortcutHelp(false)} />}
    </div>
  );
}

export default App;
