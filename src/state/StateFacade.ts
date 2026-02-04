import { BehaviorSubject, Observable } from 'rxjs';

export default class StateFacade<T> {
  private subject: BehaviorSubject<T>;

  constructor(initial: T) {
    this.subject = new BehaviorSubject<T>(initial);
  }

  // retorna snapshot atual
  getState(): T {
    return this.subject.getValue();
  }

  // atualiza o estado (substitui)
  setState(state: T): void {
    this.subject.next(state);
  }

  // merge parcial para objetos
  update(partial: Partial<T>): void {
    const current = this.getState();
    if (typeof current === 'object' && current !== null) {
      // @ts-ignore - merge simples
      this.subject.next({ ...current, ...partial });
    } else {
      // substitui se não for objeto
      // @ts-ignore
      this.subject.next(partial as T);
    }
  }

  // expõe observable para componentes
  observe(): Observable<T> {
    return this.subject.asObservable();
  }

  // reset ao estado inicial
  reset(initial: T): void {
    this.subject.next(initial);
  }
}
