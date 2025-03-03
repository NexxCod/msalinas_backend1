const socket = io();

document.addEventListener("DOMContentLoaded", () => {
    const productsContainer = document.getElementById("productsContainer");
    if (productsContainer) {
        const currentPage = new URLSearchParams(window.location.search).get("page") || 1;
        const limit = new URLSearchParams(window.location.search).get("limit") || 10;

        // Verificar si los productos ya se han cargado desde el servidor
        const productsAlreadyLoaded = productsContainer.children.length > 0;
        if (!productsAlreadyLoaded) {
            socket.emit("request-products", { page: currentPage, limit });
        }
    }

     // Verificar si hay un cartId en localStorage
     const cartId = localStorage.getItem("cartId");
     const btnViewCart = document.getElementById("btn-view-cart");
 
     if (cartId && btnViewCart) {
         // Mostrar el botón y establecer el enlace al carrito
         btnViewCart.style.display = "inline-block";
         btnViewCart.href = `/cart/${cartId}`;
     }
});
// Actualizar lista de productos en tiempo real
socket.on("update-products", (products) => {
    updateProducts(products);
});

// Función para actualizar los productos en el DOM
function updateProducts(products, paginationData) {
    const productsContainer = document.getElementById("productsContainer");
    if (!productsContainer) return;

    productsContainer.innerHTML = ""; // Limpiar contenedor

    products.forEach((product) => {
        const productElement = document.createElement("div");
        productElement.classList.add("product-card");
        productElement.id = product._id;
        productElement.innerHTML = `
            <h3>${product.title}</h3>
            <p><strong>Descripción:</strong> ${product.description}</p>
            <p><strong>Precio:</strong> $${product.price}</p>
            <p><strong>Stock:</strong> ${product.stock}</p>
            <p><strong>Categoría:</strong> ${product.category}</p>
            <a href="/products/${product._id}">Ver detalles</a>
            <button class="add-to-cart" data-id="${product._id}">Agregar al carrito</button>
            <button class="delete-button" data-id="${product._id}">Eliminar de DB</button>
        `;

        productsContainer.appendChild(productElement);
    });

    // Actualizar los enlaces de paginación si se proporcionan datos de paginación
    if (paginationData) {
        updatePaginationLinks(paginationData);
    }
}

// Manejar eventos de clic
document.addEventListener("click", async (e) => {
    const target = e.target;
    const productId = target.getAttribute("data-id");

    if (target.classList.contains("delete-button")) {
        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Error al eliminar el producto");
            }

            // Actualizar la lista de productos después de eliminar uno
            const currentPage = new URLSearchParams(window.location.search).get("page") || 1;
            const limit = new URLSearchParams(window.location.search).get("limit") || 10;
            const productsResponse = await fetch(`/api/products?limit=${limit}&page=${currentPage}`);
            if (!productsResponse.ok) throw new Error("Error al obtener productos");

            const productsData = await productsResponse.json();
            updateProducts(productsData.payload, productsData); // Actualizar productos y paginación
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            alert("No se pudo eliminar el producto.");
        }
    }

    if (target.classList.contains("add-to-cart")) {
        const cartId = localStorage.getItem("cartId") || await createCart();

        if (!cartId) {
            alert("No se pudo crear el carrito. Intenta de nuevo.");
            return;
        }

        try {
            const response = await fetch(`/api/cart/${cartId}/products/${productId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ quantity: 1 })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Hubo un error al agregar el producto al carrito");
            }

            const data = await response.json();
            alert("Producto agregado al carrito");
            console.log("Carrito actualizado:", data);
        } catch (error) {
            console.error("Error al agregar el producto al carrito:", error);
            alert(error.message || "No se pudo agregar el producto al carrito.");
        }
    }

    // Manejar cambio de página sin recargar
    if (target.classList.contains("pagination-link")) {
        e.preventDefault();
        const page = target.getAttribute("data-page");
        const limit = 10;

        try {
            // Obtener los productos de la página seleccionada
            const response = await fetch(`/api/products?limit=${limit}&page=${page}`);
            if (!response.ok) throw new Error("Error al obtener productos");

            const data = await response.json();

            // Actualizar la vista con los nuevos productos
            updateProducts(data.payload, data);

            // Actualizar la URL sin recargar la página
            window.history.pushState({}, "", `/?page=${page}&limit=${limit}`);
        } catch (error) {
            console.error("Error al cambiar de página:", error);
        }
    }
});

// Función para actualizar los enlaces de paginación
function updatePaginationLinks(data) {
    const paginationContainer = document.querySelector(".pagination");
    if (!paginationContainer) return;

    paginationContainer.innerHTML = `
        ${data.hasPrevPage ? `<a href="/?page=${data.prevPage}&limit=10" class="pagination-link" data-page="${data.prevPage}">Anterior</a>` : ''}
        <span>Página ${data.page} de ${data.totalPages}</span>
        ${data.hasNextPage ? `<a href="/?page=${data.nextPage}&limit=10" class="pagination-link" data-page="${data.nextPage}">Siguiente</a>` : ''}
    `;
}

// Manejar el formulario para agregar productos
const form = document.getElementById("formNewProduct");
if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const productData = {};

        formData.forEach((value, key) => {
            productData[key] = value;
        });

        productData.price = Number(productData.price);
        productData.stock = Number(productData.stock);

        socket.emit("new-product", productData);
        form.reset();
    });
}

// Función para crear un carrito
async function createCart() {
    try {
        const response = await fetch("/api/cart", { method: "POST" });
        if (!response.ok) throw new Error("No se pudo crear el carrito");

        const data = await response.json();
        localStorage.setItem("cartId", data._id);
        return data._id;
    } catch (error) {
        console.error("Error al crear el carrito:", error);
        alert("Error al crear el carrito. Intenta de nuevo.");
        return null;
    }
}