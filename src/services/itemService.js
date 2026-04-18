import { v4 as uuidv4 } from "uuid";

function createItem(name, price, quantity) {
  return {
    id: uuidv4(),
    name,
    price,
    quantity
  };
}

export default createItem;