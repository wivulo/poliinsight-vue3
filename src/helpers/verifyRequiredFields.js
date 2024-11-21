export const verifyRequiredFields = (fields) =>{
    let fieldInvalidName = [];

    const fieldInvalid = Object.entries(fields).reduce((acc, [key, value]) => {
        if (value === '' || value === null) {
            acc[key] = value;
            fieldInvalidName.push(key);
        }
        return acc;
    }, {});

    const count = fieldInvalidName.length;
    const valid = count === 0;

    return [fieldInvalid, valid, fieldInvalidName];
}