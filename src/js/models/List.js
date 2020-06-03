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
        this.items.push(item);
        return item;
    }

    deleteItem(id) {
        // To delete the array item we need to find its index based on the id
        const index = this.items.findIndex(item => item.id === id);

        // Once we have the index we splice the array and remove the item
        this.items.splice(index, 1);
    } 

    updateCount(id, newCount) {
        this.items.find(item => item.id === id).count = newCount;
    }
}