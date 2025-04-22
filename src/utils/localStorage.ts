export const saveToLocalStorage = <T>(key: string, data: T): void => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error(`Failed to save ${key} to localStorage`, e);
    }
};

export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
    try {
        const savedData = localStorage.getItem(key);
        return savedData ? JSON.parse(savedData) : defaultValue;
    } catch (e) {
        console.error(`Failed to load ${key} from localStorage`, e);
        return defaultValue;
    }
};