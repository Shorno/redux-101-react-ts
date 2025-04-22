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
        if (!savedData) return defaultValue;
        const parsedData = JSON.parse(savedData);
        if (parsedData && parsedData.length === 0) {
            return defaultValue;
        }
        return parsedData;
    } catch (e) {
        console.error(`Failed to load ${key} from localStorage`, e);
        return defaultValue;
    }
};