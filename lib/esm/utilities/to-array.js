export function ToArray(value) {
    if (Array.isArray(value)) {
        return value;
    }
    if (typeof value === 'string') {
        return value.split(' ');
    }
    return [value];
}
