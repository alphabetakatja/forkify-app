import axios from 'axios';

export default class Recipe{
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            // const data 
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
            // console.log(res);
        } catch (err) {
            console.log(err);
            alert(`Something went wrong :(`);
        }
    }

    calcTime() {
        // Assuming that we need 15 mins for every 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;

    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];

        const newIngredients = this.ingredients.map(el => {
            // 1. Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // 2. Remove parenthesis
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3. Parse ingredients into count, unit and ingredient
            // First we are turning the ingredient into an array with the split method
            const arrIng = ingredient.split(' ');
            // We need to find the index on which the unit is located
            const unitIndex = arrIng.findIndex((el2 => units.includes(el2)));

            let objIngredient;
            if (unitIndex > -1) {
                // There is a unit
                // Ex. 4 1/2 cups, arrCount is [4, 1/2] --> eval('4+1/2') --> 4.5
                // Ex. 4 cups, arrCount is [4]
                const arrCount = arrIng.slice(0, unitIndex);

                let count;
                if (arrCount. length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }
                objIngredient = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }
            } else if(parseInt(arrIng[0], 10)) {
                // There is NO unit, but the 1st element is a number
                objIngredient = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                // There is NO unit and NO number in the 1st position
                objIngredient = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }

            return objIngredient;
        });
        this.ingredients = newIngredients;
    }

    updateServings(type) {
        // Servings
        const newServings = type === 'dec' ? this.servings - 1: this.servings + 1;
        

        // Ingredients - update the counts
        this.ingredients.forEach(ingredient => {
            ingredient.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    }
}