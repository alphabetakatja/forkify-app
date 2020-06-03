import { elements } from './base';

export const renderLike = like => {
    const markup = `
        <li data-likeid=${like.id}>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.img}" alt="${like.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${like.title} ...</h4>
                    <p class="likes__author">${like.author}</p>
                </div>
            </a>
        </li>
    `;

    elements.likes.insertAdjacentHTML('beforeend', markup);
};

export const deleteLike = id => {
    const item = document.querySelector(`[data-likeid="${id}"]`);
    if (item) item.parentElement.removeChild(item);
};