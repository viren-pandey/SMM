import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUiStore = create(
    persist(
        (set) => ({
            currency: 'INR',
            theme: 'dark',
            exchangeRate: 83.5, // 1 USD = 83.5 INR

            setCurrency: (currency) => set({ currency }),
            setTheme: (theme) => set({ theme }),
            toggleTheme: () => set((state) => ({
                theme: state.theme === 'dark' ? 'light' : 'dark'
            })),
        }),
        {
            name: 'ui-storage',
        }
    )
);

export default useUiStore;
