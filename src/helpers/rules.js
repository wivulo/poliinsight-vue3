export function prepareonlyRoles (array) {
    return array.reduce((acc, item) => {
        acc.push(...item.rules.map(rule => rule.route))
        return acc
    }, [])
}
export function prepareRolesAndPath (array) {
    return array.reduce((acc, item) => {
        acc.push(...item.rules.map(rule => {
            return {
                url: rule.route,
                name: rule.name
            }
        }))
        return acc
    }, [])
}

export function perparenavAndRoles (array) {
    array = array
        .filter((item) => item.name !== "Transparente")
        .sort((a, b) => a.order - b.order);

    array.forEach((menu) => {
        menu.rules.sort((a, b) => a.order - b.order)
    });

    return array;
}
