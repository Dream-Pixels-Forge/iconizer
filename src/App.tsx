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
    { id: 'import', label: 'Import', icon: <FolderOpen className="h-5 w-5" /> },
    { id: 'sizes', label: 'Sizes', icon: <Layers className="h-5 w-5" /> },
    { id: 'formats', label: 'Formats', icon: <Palette className="h-5 w-5" /> },
    { id: 'output', label: 'Output', icon: <Download className="h-5 w-5" /> },
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

      <div className="container relative z-10 mx-auto px-6 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => setActiveStep(step.id)}
                  className={`
                    flex items-center gap-2 rounded-lg px-4 py-2 transition-all duration-200
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
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                  <span className="hidden text-sm font-medium sm:inline">{step.label}</span>
                </button>
                {index < steps.length - 1 && (
                  <div
                    className={`
                    mx-2 h-0.5 w-8 rounded-full transition-colors
                    ${getStepStatus(step.id) === 'completed' ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}
                  `}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Sidebar - Step Info */}
          <div className="lg:col-span-1">
            <div className="skeuo-card sticky top-28 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div
                  className={`
                  rounded-lg p-2
                  ${activeStep === 'import' ? 'bg-gradient-to-b from-blue-500 to-blue-600' : ''}
                  ${activeStep === 'sizes' ? 'bg-gradient-to-b from-purple-500 to-pink-500' : ''}
                  ${activeStep === 'formats' ? 'bg-gradient-to-b from-cyan-500 to-blue-500' : ''}
                  ${activeStep === 'output' ? 'bg-gradient-to-b from-green-500 to-emerald-500' : ''}
                `}
                >
                  {steps.find((s) => s.id === activeStep)?.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-white">
                    {steps.find((s) => s.id === activeStep)?.label}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Step {steps.findIndex((s) => s.id === activeStep) + 1} of 4
                  </p>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Images:</span>
                  <span className="font-medium">{images.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Sizes:</span>
                  <span className="font-medium">{selectedSizes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Formats:</span>
                  <span className="font-medium">{selectedFormats.length}</span>
                </div>
              </div>

              {/* Navigation */}
              <div className="mt-6 flex gap-2">
                <button
                  onClick={prevStep}
                  disabled={activeStep === 'import'}
                  className="skeuo-btn-outline flex-1 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!canProceed() || activeStep === 'output'}
                  className="skeuo-btn flex flex-1 items-center justify-center gap-1 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Panel */}
          <div className="lg:col-span-3">
            {/* Import Step */}
            {activeStep === 'import' && (
              <div className="skeuo-card p-6">
                <DropZone />
              </div>
            )}

            {/* Sizes Step */}
            {activeStep === 'sizes' && (
              <div className="space-y-6">
                <div className="skeuo-card p-6">
                  <SizeSelector />
                </div>
                <div className="skeuo-card p-6">
                  <PresetConfigurations />
                </div>
              </div>
            )}

            {/* Formats Step */}
            {activeStep === 'formats' && (
              <div className="skeuo-card p-6">
                <FormatSelector />
              </div>
            )}

            {/* Output Step */}
            {activeStep === 'output' && (
              <div className="skeuo-card p-6">
                <OutputPanel />
              </div>
            )}
          </div>
        </div>
      </div>

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
