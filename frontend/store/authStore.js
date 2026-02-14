import { create } from 'zustand';
import api from '@/lib/api';

const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    loading: true,

    loadUser: async () => {
        try {
            const res = await api.get('/auth/me');
            set({ user: res.data.data, isAuthenticated: true, loading: false });
        } catch (err) {
            set({ user: null, isAuthenticated: false, loading: false });
        }
    },

    login: async (email, password) => {
        set({ loading: true });
        try {
            await api.post('/auth/login', { email, password });
            await useAuthStore.getState().loadUser();
            return { success: true };
        } catch (err) {
            set({ loading: false });
            return { success: false, error: err.response?.data?.message || err.response?.data?.error || 'Login failed' };
        }
    },

    logout: async () => {
        try {
            await api.get('/auth/logout');
            set({ user: null, isAuthenticated: false });
        } catch (err) {
            console.error('Logout failed');
        }
    }
}));

export default useAuthStore;
