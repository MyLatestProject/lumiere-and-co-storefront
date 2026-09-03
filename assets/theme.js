// Lightweight Alpine.js integration for Cart Drawer & AJAX
document.addEventListener('alpine:init', () => {
  // Cart state management
  Alpine.store('cart', {
    items: [],
    total: 0,
    async fetch() {
      const response = await fetch('/cart.js');
      const data = await response.json();
      this.items = data.items;
      this.total = data.total_price / 100;
      this.render();
    },
    async add(variantId, quantity) {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: variantId, quantity: quantity })
      });
      if (response.ok) {
        await this.fetch();
        window.dispatchEvent(new CustomEvent('open-cart'));
      }
    },
    render() {
      const container = document.getElementById('cart-items-container');
      const subtotalEl = document.getElementById('cart-subtotal');
      
      if (this.items.length === 0) {
        container.innerHTML = '<p class="text-center text-lumiere-charcoal/60 mt-10">Your cart is currently empty.</p>';
        subtotalEl.innerText = '$0.00';
        return;
      }

      let html = '<div class="space-y-6">';
      this.items.forEach(item => {
        html += `
          <div class="flex gap-4">
            <img src="${item.image}" alt="${item.title}" class="w-20 h-20 object-cover rounded-sm">
            <div class="flex-1">
              <h3 class="font-serif text-lg">${item.product_title}</h3>
              <p class="text-sm text-lumiere-charcoal/60">${item.variant_title}</p>
              <div class="flex justify-between items-center mt-2">
                <span class="text-sm font-medium">$${(item.price / 100).toFixed(2)}</span>
                <span class="text-sm text-lumiere-charcoal/60">Qty: ${item.quantity}</span>
              </div>
            </div>
          </div>
        `;
      });
      html += '</div>';
      container.innerHTML = html;
      subtotalEl.innerText = `$${this.total.toFixed(2)}`;
    }
  });

  window.addEventListener('open-cart', () => {
    document.querySelector('[x-data]').__x.$data.cartOpen = true;
  });
});

document.addEventListener('DOMContentLoaded', () => {
  Alpine.store('cart').fetch();
});