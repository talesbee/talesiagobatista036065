import { describe, it, expect } from 'vitest';
import StateFacade from './StateFacade';

describe('StateFacade', () => {
  it('should return initial state', () => {
    const f = new StateFacade({ a: 1 });
    expect(f.getState()).toEqual({ a: 1 });
  });

  it('should set and get state', () => {
    const f = new StateFacade({ a: 1 });
    f.setState({ a: 2 });
    expect(f.getState()).toEqual({ a: 2 });
  });

  it('should update partial state', () => {
    const f = new StateFacade({ a: 1, b: 2 });
    f.update({ b: 3 });
    expect(f.getState()).toEqual({ a: 1, b: 3 });
  });

  it('should reset to initial', () => {
    const f = new StateFacade({ a: 5 });
    f.setState({ a: 10 });
    f.reset({ a: 5 });
    expect(f.getState()).toEqual({ a: 5 });
  });
});
