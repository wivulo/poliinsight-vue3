export const dateFormatter = (date) => {
    const current = new Date(date);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    
    const formatter = new Intl.DateTimeFormat('pt-AO', options);

    return formatter.format(current)
}