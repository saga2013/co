const cart = JSON.parse(localStorage.getItem('cart')) || [];

const cartContainer = document.getElementById('cart-container');
const cartItemsContainer = document.getElementById('cart-items');
const emptyText = document.getElementById('empty-text');

if (cart.length > 0) {
  emptyText.textContent = 'Корзина:';
  cartItemsContainer.innerHTML = '';
  cart.forEach(item => {
    const div = document.createElement('div');
    div.innerHTML = `
      <p>${item.title} (${item.size} см) — ${item.quantity} шт. — ${item.price * item.quantity} ₽</p>
    `;
    cartItemsContainer.appendChild(div);
  });
} else {
  emptyText.textContent = 'Корзина пустая';
}

document.getElementById('back').addEventListener('click', () => {
  window.location.href = 'index.html';
});
