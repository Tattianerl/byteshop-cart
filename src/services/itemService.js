import { v4 as uuidv4 } from "uuid";

//O QUE ELE FAZ
//Cria o item de forma padronizada.
// casos de usos dos itens

// -> criar item com subtotal 
function createItem(name, price, quantity) {
  return {
    id: uuidv4(),
    name,
    price,
    quantity
  };
}

export default createItem;