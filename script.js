const piz = document.getElementById('piz');
const za = document.getElementById('za');
let btns = document.querySelectorAll('.btn');
const select = document.getElementById('select');
const pizzaContainer = document.getElementById('pizzaContainer');
const cartContainer = document.getElementById('cart-Container'); 
const piza = document.getElementById('piza');

let allPizzas = [];
let cart = [];

fetch('db.json')
  .then(res => res.json())
  .then(data => {
    allPizzas = data.pizzas;
    generator(allPizzas);
    fiterByType();
    select.addEventListener('change', sort);
    updateCartUI(); 
  });

function generator(pizzas) {
  pizzaContainer.innerHTML = ``;

  pizzas.forEach(pizza => {
    const card = document.createElement('div');
    card.classList.add('card');

    const defaultSize = pizza.sizes[0];
    const defaultPrice = pizza.prices[defaultSize];

    card.innerHTML = `
      <img src="${pizza.imageUrl}" alt="">
      <h2>${pizza.title}</h2>
      <div class="types">
        ${pizza.types.map(type => `<button class="type">${type}</button>`).join('')}
      </div>
      <div class="sizes">
        ${pizza.sizes.map(size => `<button class="size" data-size="${size}">${size} см</button>`).join('')}
      </div>
      <div class="bot">от <span class="price">${defaultPrice}</span>₽</div>
      <button class="add">Добавить</button>
    `;

    const sizeButtons = card.querySelectorAll('.size');
    const priceSpan = card.querySelector('.price');

    sizeButtons.forEach(button => {
      button.addEventListener('click', () => {
        sizeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const selectedSize = button.getAttribute('data-size');
        const newPrice = pizza.prices[selectedSize];
        priceSpan.textContent = newPrice;
      });
    });

    const addBtn = card.querySelector('.add');
    addBtn.addEventListener('click', () => {
      const selectedSizeBtn = card.querySelector('.size.active') || card.querySelector('.size');
      const selectedSize = selectedSizeBtn.getAttribute('data-size');
      const selectedPrice = pizza.prices[selectedSize];

      const existingItem = cart.find(item => item.title === pizza.title && item.size === selectedSize);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        const cartItem = {
          title: pizza.title,
          size: selectedSize,
          price: selectedPrice,
          quantity: 1
        };
        cart.push(cartItem);
      }

      updateCartUI();
      localStorage.setItem('cart', JSON.stringify(cart));

    });

    pizzaContainer.appendChild(card);
  });
}

function updateCartUI() {
  piz.textContent = `🛒(${cart.length})`;
  za.textContent = `${cart.reduce((sum, item) => sum + item.price * item.quantity, 0)} ₽`;

  cart.forEach(item => {
    const cartItem= document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
      <span>${item.title} (${item.size} см) x ${item.quantity}</span>
      <span>${item.price * item.quantity} ₽</span>
    `;
    cartContainer.appendChild(cartItem);
  });
}

function fiterByType() {
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const value = btn.value;

      btns.forEach(bt => bt.classList.remove('bg'));
      btn.classList.add('bg');

      if (value === 'all') {
        generator(allPizzas);
      } else {
        const filtered = allPizzas.filter(pizza =>
          pizza.category.trim().toLowerCase() === value.trim().toLowerCase()
        );
        generator(filtered);
      }
    });
  });
}

function sort() {
  const selectValue = select.value.toLowerCase();
  if (selectValue === 'price') {
    allPizzas.sort((a, b) => a.prices[a.sizes[0]] - b.prices[b.sizes[0]]);
  } else if (selectValue === 'alpha') {
    allPizzas.sort((a, b) => a.title.localeCompare(b.title));
  } else if (selectValue === 'pop') {
    allPizzas.sort((a, b) => b.rating - a.rating);
  }
  generator(allPizzas);
}
piza.addEventListener('click', ()=>{
  window.location.href= 'cart.html'
})

