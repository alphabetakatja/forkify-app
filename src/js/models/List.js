import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }
    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        };

    }

    deleteItem(id) {
        // To delete the array item we need to find the index of it
        const index = this.items.findIndex(el => el.id === id);
        // Once we have the index we spice the array and remove the item
        this.items.splice(index, 1);
    } 
}