export function objFrequencyToArray(obj) {
    const result = [];

    for (const key in obj) {
        const frequency = obj[key];

        result.push(frequency);
    }

    return result;
}