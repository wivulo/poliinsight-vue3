// Criação de um novo Map
const GROUPS = new Map<string, number>();

// Adicionando elementos ao Map
/*
    admininistrator: true,
    organizador: true,
    participant: true,
    speaker: true,
    coordinator: true,
    colaborator: true,
    "Deparment Manager": true
*/
GROUPS.set('admininistrator', 1);
GROUPS.set('organizador', 2);
GROUPS.set('participant', 3);
GROUPS.set('speaker', 4);
GROUPS.set('coordinator', 5);
GROUPS.set('colaborator', 6);
GROUPS.set('Deparment Manager', 7);

export { GROUPS }

// // Acessando elementos do Map
// console.log(map.get('um')); // Saída: 1
// console.log(map.get('dois')); // Saída: 2

// // Verificando se uma chave existe no Map
// console.log(map.has('três')); // Saída: true
// console.log(map.has('quatro')); // Saída: false

// // Removendo um elemento do Map
// map.delete('dois');

// // Iterando sobre os elementos do Map
// map.forEach((value, key) => {
//     console.log(`${key}: ${value}`);
// });

// // Saída esperada:
// // um: 1
// // três: 3

// // Limpando todos os elementos do Map
// map.clear();
// console.log(map.size); // Saída: 0