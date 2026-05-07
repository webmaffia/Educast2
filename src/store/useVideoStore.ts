import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VideoWizardState {
  title: string;
  content: string;
  avatarId: string;
  backgroundId: string;
  layout: string;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setAvatarId: (id: string) => void;
  setBackgroundId: (id: string) => void;
  setLayout: (layout: string) => void;
  reset: () => void;
}

export const useVideoStore = create<VideoWizardState>()(
  persist(
    (set) => ({
      title: '',
      content: '',
      avatarId: 'a1',
      backgroundId: 'b1',
      layout: 'SPLIT_SCREEN',
      setTitle: (title) => set({ title }),
      setContent: (content) => set({ content }),
      setAvatarId: (avatarId) => set({ avatarId }),
      setBackgroundId: (backgroundId) => set({ backgroundId }),
      setLayout: (layout) => set({ layout }),
      reset: () => set({ title: '', content: '', avatarId: 'a1', backgroundId: 'b1', layout: 'SPLIT_SCREEN' }),
    }),
    {
      name: 'educast-wizard-storage',
    }
  )
);
