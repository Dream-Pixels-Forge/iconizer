import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PresetConfigurations from './PresetConfigurations';
import { useConfigStore } from '../../stores/configStore';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('PresetConfigurations', () => {
  beforeEach(() => {
    // Reset store and localStorage before each test
    useConfigStore.setState({
      selectedSizes: [],
      selectedFormats: [],
    });
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('renders preset configurations component', () => {
    render(<PresetConfigurations />);
    
    expect(screen.getByText(/custom presets/i)).toBeInTheDocument();
    expect(
      screen.getByText(/save and reuse your favorite configurations/i)
    ).toBeInTheDocument();
  });

  it('shows save button initially', () => {
    render(<PresetConfigurations />);
    
    expect(
      screen.getByText(/save current configuration as preset/i)
    ).toBeInTheDocument();
  });

  it('shows save form when save button clicked', () => {
    render(<PresetConfigurations />);
    
    const saveButton = screen.getByText(/save current configuration as preset/i);
    fireEvent.click(saveButton);
    
    expect(screen.getByLabelText(/preset name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByText(/save preset/i)).toBeInTheDocument();
  });

  it('requires preset name', async () => {
    render(<PresetConfigurations />);
    
    const saveButton = screen.getByText(/save current configuration as preset/i);
    fireEvent.click(saveButton);
    
    const savePresetButton = screen.getByText(/save preset/i);
    fireEvent.click(savePresetButton);
    
    await waitFor(() => {
      expect(screen.getByText(/preset name is required/i)).toBeInTheDocument();
    });
  });

  it('requires at least one size or format selected', async () => {
    render(<PresetConfigurations />);
    
    const saveButton = screen.getByText(/save current configuration as preset/i);
    fireEvent.click(saveButton);
    
    const nameInput = screen.getByLabelText(/preset name/i);
    fireEvent.change(nameInput, { target: { value: 'Test Preset' } });
    
    const savePresetButton = screen.getByText(/save preset/i);
    fireEvent.click(savePresetButton);
    
    await waitFor(() => {
      expect(
        screen.getByText(/select at least one size or format/i)
      ).toBeInTheDocument();
    });
  });

  it('saves a preset with selected sizes and formats', async () => {
    // Select some sizes and formats first
    useConfigStore.getState().toggleSize('16x16');
    useConfigStore.getState().toggleFormat('png');
    
    render(<PresetConfigurations />);
    
    const saveButton = screen.getByText(/save current configuration as preset/i);
    fireEvent.click(saveButton);
    
    const nameInput = screen.getByLabelText(/preset name/i);
    const descInput = screen.getByLabelText(/description/i);
    
    fireEvent.change(nameInput, { target: { value: 'Web Icons' } });
    fireEvent.change(descInput, { target: { value: 'Web favicon preset' } });
    
    const savePresetButton = screen.getByText(/save preset/i);
    fireEvent.click(savePresetButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Web Icons/i)).toBeInTheDocument();
      expect(screen.getByText(/Web favicon preset/i)).toBeInTheDocument();
    });
    
    // Verify localStorage was called
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'iconizer-custom-presets',
      expect.any(String)
    );
  });

  it('displays saved presets', () => {
    // Mock existing preset in localStorage
    const mockPresets = [
      {
        id: 'test-1',
        name: 'Test Preset',
        description: 'Test description',
        sizes: ['16x16', '32x32'],
        formats: ['png' as const],
        isDefault: false,
      },
    ];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockPresets));
    
    render(<PresetConfigurations />);
    
    expect(screen.getByText(/Test Preset/i)).toBeInTheDocument();
    expect(screen.getByText(/Test description/i)).toBeInTheDocument();
  });

  it('shows preset metadata (sizes and formats count)', () => {
    const mockPresets = [
      {
        id: 'test-1',
        name: 'Test Preset',
        description: 'Test description',
        sizes: ['16x16', '32x32', '48x48'],
        formats: ['png' as const, 'jpg' as const],
        isDefault: false,
      },
    ];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockPresets));
    
    render(<PresetConfigurations />);
    
    expect(screen.getByText(/3 sizes/i)).toBeInTheDocument();
    expect(screen.getByText(/2 formats/i)).toBeInTheDocument();
  });

  it('allows deleting a preset', () => {
    const mockPresets = [
      {
        id: 'test-1',
        name: 'Test Preset',
        description: 'Test description',
        sizes: [],
        formats: [],
        isDefault: false,
      },
    ];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockPresets));
    
    render(<PresetConfigurations />);
    
    const deleteButton = screen.getByRole('button', { name: /delete preset/i });
    fireEvent.click(deleteButton);
    
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  it('allows editing a preset name', () => {
    const mockPresets = [
      {
        id: 'test-1',
        name: 'Old Name',
        description: 'Old description',
        sizes: [],
        formats: [],
        isDefault: false,
      },
    ];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockPresets));
    
    render(<PresetConfigurations />);
    
    const editButton = screen.getByRole('button', { name: /edit preset/i });
    fireEvent.click(editButton);
    
    expect(screen.getByPlaceholderText(/e.g., Social Media Icons/i)).toHaveValue('Old Name');
  });

  it('cancels editing without saving', () => {
    const mockPresets = [
      {
        id: 'test-1',
        name: 'Test Preset',
        description: 'Test description',
        sizes: [],
        formats: [],
        isDefault: false,
      },
    ];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockPresets));
    
    render(<PresetConfigurations />);
    
    const editButton = screen.getByRole('button', { name: /edit preset/i });
    fireEvent.click(editButton);
    
    const cancelButton = screen.getByRole('button', { name: /✕/i });
    fireEvent.click(cancelButton);
    
    expect(screen.getByText(/Test Preset/i)).toBeInTheDocument();
  });

  it('loads preset when load button clicked', () => {
    const mockPresets = [
      {
        id: 'test-1',
        name: 'Test Preset',
        description: 'Test description',
        sizes: ['16x16', '32x32'],
        formats: ['png' as const, 'webp' as const],
        isDefault: false,
      },
    ];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockPresets));
    
    render(<PresetConfigurations />);
    
    const loadButton = screen.getByRole('button', { name: /load preset/i });
    fireEvent.click(loadButton);
    
    const state = useConfigStore.getState();
    expect(state.selectedSizes).toContain('16x16');
    expect(state.selectedSizes).toContain('32x32');
    expect(state.selectedFormats).toContain('png');
    expect(state.selectedFormats).toContain('webp');
  });
});
