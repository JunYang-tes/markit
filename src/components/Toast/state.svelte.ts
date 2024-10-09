import { nanoid } from 'nanoid';
export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number; // 可选属性
}
export const toasts = $state([] as Toast[])

export function addToast(toast: Omit<Toast, 'id'>) {
    const newToast: Toast = {
        ...toast,
        id: nanoid()
    };
    if (newToast.duration) {
        setTimeout(() => {
            deleteToast(newToast.id);
        }, newToast.duration);
    }
    toasts.push(newToast)
}

export function deleteToast(id: string) {
    const index = toasts.findIndex(toast => toast.id === id);
    if (index !== -1) {
        toasts.splice(index, 1);
    }
}
