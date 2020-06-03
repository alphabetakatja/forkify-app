export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, autor, img) {
        const like = { id, title, author, img};
        this.likes.push(like);
        return like;
    }

    deleteLike(id) {
        // To delete the array item we need to find its index based on the id
        const index = this.likes.findIndex(item => item.id === id);
        this.likes.splice(index, 1);
    } 

    isLiked(id) {
        return this.like.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }

}