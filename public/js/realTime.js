const socket = io();

const form = document.getElementById('formNewProduct');
const productsContainer = document.getElementById('productsContainer');

// Enviar nuevo producto al servidor
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const productData = {};

    formData.forEach((value, key) => {
        productData[key] = value;
    });

    // Convertir valores numéricos correctamente
    productData.price = Number(productData.price);
    productData.stock = Number(productData.stock);

    socket.emit('new-product', productData);

    form.reset();
});

// Escuchar evento para agregar productos en tiempo real
socket.on('ProductAdded', (product) => {
    addProductToDOM(product);
});

// Escuchar evento para eliminar productos en tiempo real
socket.on('ProductRemoved', (productId) => {
    const productToRemove = document.getElementById(productId);
    if (productToRemove) {
        productToRemove.remove();
    }
});

// Función para agregar un producto al DOM
function addProductToDOM(product) {
    const productElement = document.createElement('div');
    productElement.classList.add('product-card');
    productElement.id = product.id;

    productElement.innerHTML = `
        <h3 class="product-title">${product.title}</h3>
        <p class="product-description">${product.description}</p>
        <p class="product-code"><strong>Código:</strong> ${product.code}</p>
        <p class="product-price"><strong>Precio:</strong> $${product.price}</p>
        <p class="product-stock"><strong>Stock:</strong> ${product.stock} disponibles</p>
        <p class="product-category"><strong>Categoría:</strong> ${product.category}</p>
        <button class="delete-button" data-id="${product.id}">Eliminar</button>
    `;

    // Agregar el producto al contenedor
    productsContainer.appendChild(productElement);

    // Agregar evento de eliminación al botón recién creado
    productElement.querySelector('.delete-button').addEventListener('click', (e) => {
        const productId = e.target.getAttribute('data-id');
        socket.emit('ProductDeleted', productId);
    });
}

// Delegar evento para los productos que ya estaban en la página al cargar
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-button')) {
        const productId = e.target.getAttribute('data-id');
        socket.emit('ProductDeleted', productId);
    }
});
