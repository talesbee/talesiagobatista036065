import { describe, it, expect } from 'vitest';
import StateFacade from './StateFacade';

describe('StateFacade', () => {
  it('deve retornar o estado inicial', () => {
    const f = new StateFacade({ a: 1 });
    expect(f.getState()).toEqual({ a: 1 });
  });

  it('deve setar e obter o estado', () => {
    const f = new StateFacade({ a: 1 });
    f.setState({ a: 2 });
    expect(f.getState()).toEqual({ a: 2 });
  });

  it('deve atualizar parcialmente o estado', () => {
    const f = new StateFacade({ a: 1, b: 2 });
    f.update({ b: 3 });
    expect(f.getState()).toEqual({ a: 1, b: 3 });
  });

  it('deve resetar para o estado inicial', () => {
    const f = new StateFacade({ a: 5 });
    f.setState({ a: 10 });
    f.reset({ a: 5 });
    expect(f.getState()).toEqual({ a: 5 });
  });
});
