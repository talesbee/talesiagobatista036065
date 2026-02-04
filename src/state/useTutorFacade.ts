import { useEffect, useState, useCallback } from 'react';
import { tutorFacade } from './TutorFacade';
import type { Tutor, TutorPayload } from '../types';

export function useTutorFacade() {
  const [tutors, setTutors] = useState<Tutor[]>(tutorFacade.getSnapshot());
  const [selected, setSelected] = useState<Tutor | null>(
    tutorFacade.selectedTutor$().getValue?.() ?? null,
  );

  useEffect(() => {
    const sub1 = tutorFacade.tutors$().subscribe(setTutors);
    const sub2 = tutorFacade.selectedTutor$().subscribe(setSelected);
    tutorFacade.loadTutors().catch(() => {});
    return () => {
      sub1.unsubscribe();
      sub2.unsubscribe();
    };
  }, []);

  const createTutor = useCallback((payload: TutorPayload) => tutorFacade.createTutor(payload), []);
  const selectTutor = useCallback((t: Tutor | null) => tutorFacade.selectTutor(t), []);

  return {
    tutors,
    selected,
    createTutor,
    selectTutor,
    reload: tutorFacade.loadTutors.bind(tutorFacade),
  };
}
