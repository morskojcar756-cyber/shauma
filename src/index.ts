import type { IBasket } from "./interface.js";

const stock = [10, 13, 20, 12, 14, 11];
const RESTOCK_AMOUNT = 10;

const cards = document.querySelectorAll('.card');
const cartItemsEl = document.querySelector('.cart-items');
const cartTotalEl = document.querySelector('.cart-total');

// что лежит в корзине: { индекс карточки: количество }
const cart:IBasket[] = [];

function renderCart() {
    cartItemsEl!.innerHTML = '';
    let total = 0;

    cards.forEach((card:Element, i:number) => {
        if (!cart[i]) return;
        total += cart[i].count;

        const name = card.querySelector('p')!.firstChild!.textContent;
        const li = document.createElement('li');

        const text = document.createElement('span');
        text.textContent = `${name} — ${cart[i]} шт.`;

        const btnMinus = document.createElement('button');
        btnMinus.textContent = '−';
        btnMinus.className = 'cart-btn';
        btnMinus.addEventListener('click', () => {
            cart[i]?.count;
            card.count++;          // товар вернулся на склад
            card.update();
            renderCart();
        });

        const btnRemove = document.createElement('button');
        btnRemove.textContent = '✕';
        btnRemove.className = 'cart-btn';
        btnRemove.addEventListener('click', () => {
            card.count += cart[i]; // возвращаем всё на склад
            cart[i] = 0;
            card.update();
            renderCart();
        });

        li.append(text, btnMinus, btnRemove);
        cartItemsEl.append(li);
    });

    cartTotalEl.textContent = `Итого: ${total} шт.`;
}

cards.forEach((card, i) => {
    const btn = card.querySelector('.minus');
    const valueEl = card.querySelector('.qty-value');

    card.max = stock[i] || 0;
    card.count = card.max;

    card.update = function () {
        valueEl.textContent = `${card.count} шт.`;
        btn.disabled = card.count <= 0;
    };

    btn.addEventListener('click', () => {
        if (card.count > 0) {
            card.count--;
            card.update();
            cart[i] = (cart[i] || 0) + 1;  // кладём в корзину
            renderCart();
        }
    });

    card.update();
});

const restockBtn = document.querySelector('.restock-btn');

restockBtn.addEventListener('click', () => {
    cards.forEach((card) => {
        card.count = Math.min(card.count + RESTOCK_AMOUNT, card.max);
        card.update();
    });
});// ---- Слайд-шоу ----
const slides = document.querySelector('.slides');
const slideImgs = slides.querySelectorAll('img');
const prevBtn = document.querySelector('.slide-btn.prev');
const nextBtn = document.querySelector('.slide-btn.next');
const dotsEl = document.querySelector('.dots');

let current = 0;
const slideInterval = 4000; // автолистание каждые 4 секунды
let timer = null;

// создаём точки по числу картинок
slideImgs.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'dot';
    dot.addEventListener('click', () => goTo(i));
    dotsEl.append(dot);
});

function update() {
    slides.style.transform = `translateX(-${current * 100}%)`;
    dotsEl.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
    });
}

function goTo(i) {
    current = (i + slideImgs.length) % slideImgs.length;
    update();
    restart(); // после ручного листания отсчёт начинается заново
}

function next() { goTo(current + 1); }
function prev() { goTo(current - 1); }

function restart() {
    clearInterval(timer);
    timer = setInterval(next, slideInterval);
}

nextBtn.addEventListener('click', next);
prevBtn.addEventListener('click', prev);

restart(); // запускаем автолистание