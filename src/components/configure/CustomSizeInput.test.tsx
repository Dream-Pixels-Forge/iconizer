import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomSizeInput from './CustomSizeInput';
import { useConfigStore } from '../../stores/configStore';

describe('CustomSizeInput', () => {
  beforeEach(() => {
    // Reset store before each test
    useConfigStore.setState({ customSizes: [] });
  });

  it('renders custom size input form', () => {
    render(<CustomSizeInput />);
    
    expect(screen.getByLabelText(/width/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/height/i)).toBeInTheDocument();
    expect(screen.getByText(/add custom size/i)).toBeInTheDocument();
  });

  it('displays aspect ratio lock option', () => {
    render(<CustomSizeInput />);
    
    expect(screen.getByLabelText(/lock aspect ratio/i)).toBeInTheDocument();
  });

  it('allows entering width and height values', () => {
    render(<CustomSizeInput />);
    
    const widthInput = screen.getByLabelText(/width/i);
    const heightInput = screen.getByLabelText(/height/i);
    
    fireEvent.change(widthInput, { target: { value: '200' } });
    fireEvent.change(heightInput, { target: { value: '300' } });
    
    expect(widthInput).toHaveValue(200);
    expect(heightInput).toHaveValue(300);
  });

  it('validates minimum dimension', () => {
    render(<CustomSizeInput />);
    
    const widthInput = screen.getByLabelText(/width/i);
    const addButton = screen.getByText(/add custom size/i);
    
    fireEvent.change(widthInput, { target: { value: '0' } });
    fireEvent.change(screen.getByLabelText(/height/i), { target: { value: '100' } });
    fireEvent.click(addButton);
    
    // Should show error or clamp to minimum
    expect(screen.getByText(/valid dimensions/i)).toBeInTheDocument();
  });

  it('validates maximum dimension', () => {
    render(<CustomSizeInput />);
    
    const widthInput = screen.getByLabelText(/width/i);
    const addButton = screen.getByText(/add custom size/i);
    
    fireEvent.change(widthInput, { target: { value: '20000' } });
    fireEvent.change(screen.getByLabelText(/height/i), { target: { value: '100' } });
    fireEvent.click(addButton);
    
    // Should show error or clamp to maximum
    expect(screen.getByText(/valid dimensions/i)).toBeInTheDocument();
  });

  it('prevents adding duplicate sizes', () => {
    render(<CustomSizeInput />);
    
    const widthInput = screen.getByLabelText(/width/i);
    const heightInput = screen.getByLabelText(/height/i);
    const addButton = screen.getByText(/add custom size/i);
    
    // Add first size
    fireEvent.change(widthInput, { target: { value: '100' } });
    fireEvent.change(heightInput, { target: { value: '100' } });
    fireEvent.click(addButton);
    
    // Try to add same size again
    fireEvent.change(widthInput, { target: { value: '100' } });
    fireEvent.change(heightInput, { target: { value: '100' } });
    fireEvent.click(addButton);
    
    expect(screen.getByText(/already exists/i)).toBeInTheDocument();
  });

  it('adds custom size to store', () => {
    render(<CustomSizeInput />);
    
    const widthInput = screen.getByLabelText(/width/i);
    const heightInput = screen.getByLabelText(/height/i);
    const addButton = screen.getByText(/add custom size/i);
    
    fireEvent.change(widthInput, { target: { value: '256' } });
    fireEvent.change(heightInput, { target: { value: '128' } });
    fireEvent.click(addButton);
    
    const state = useConfigStore.getState();
    expect(state.customSizes).toHaveLength(1);
    expect(state.customSizes[0].width).toBe(256);
    expect(state.customSizes[0].height).toBe(128);
  });

  it('clears inputs after adding size', () => {
    render(<CustomSizeInput />);
    
    const widthInput = screen.getByLabelText(/width/i);
    const heightInput = screen.getByLabelText(/height/i);
    const addButton = screen.getByText(/add custom size/i);
    
    fireEvent.change(widthInput, { target: { value: '256' } });
    fireEvent.change(heightInput, { target: { value: '128' } });
    fireEvent.click(addButton);
    
    expect(widthInput).toHaveValue('');
    expect(heightInput).toHaveValue('');
  });

  it('displays added custom sizes', () => {
    render(<CustomSizeInput />);
    
    // Add a size
    const widthInput = screen.getByLabelText(/width/i);
    const heightInput = screen.getByLabelText(/height/i);
    const addButton = screen.getByText(/add custom size/i);
    
    fireEvent.change(widthInput, { target: { value: '512' } });
    fireEvent.change(heightInput, { target: { value: '512' } });
    fireEvent.click(addButton);
    
    expect(screen.getByText(/512 × 512 px/i)).toBeInTheDocument();
  });

  it('removes custom size when delete button clicked', () => {
    render(<CustomSizeInput />);
    
    // Add a size
    const widthInput = screen.getByLabelText(/width/i);
    const heightInput = screen.getByLabelText(/height/i);
    const addButton = screen.getByText(/add custom size/i);
    
    fireEvent.change(widthInput, { target: { value: '128' } });
    fireEvent.change(heightInput, { target: { value: '128' } });
    fireEvent.click(addButton);
    
    // Delete the size
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);
    
    const state = useConfigStore.getState();
    expect(state.customSizes).toHaveLength(0);
  });

  it('supports enter key to add size', () => {
    render(<CustomSizeInput />);
    
    const widthInput = screen.getByLabelText(/width/i);
    const heightInput = screen.getByLabelText(/height/i);
    
    fireEvent.change(widthInput, { target: { value: '64' } });
    fireEvent.change(heightInput, { target: { value: '64' } });
    fireEvent.keyDown(heightInput, { key: 'Enter' });
    
    const state = useConfigStore.getState();
    expect(state.customSizes).toHaveLength(1);
  });
});
