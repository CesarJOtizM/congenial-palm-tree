import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';

// Mock de fetch global
global.fetch = vi.fn();

// Configuración de testing-library
import { configure } from '@testing-library/react';
configure({ testIdAttribute: 'data-testid' });

// Hacer React disponible globalmente
global.React = React;
