export const emailValidator = (value) => {
    const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  
    return regex.test(value);
}

export const isEmpty = (value) => {
    return value.trim() === '';
}

export const minLength = (value) => {
    return value.length >= 4;
}

