document.addEventListener("DOMContentLoaded", () => {
    // Eliminar un producto del carrito
    document.addEventListener("click", async (e) => {
        if (e.target.classList.contains("remove-from-cart")) {
            const cartId = e.target.getAttribute("data-cart-id");
            const productId = e.target.getAttribute("data-product-id");

            try {
                const response = await fetch(`/api/cart/${cartId}/products/${productId}`, {
                    method: "DELETE",
                });

                if (!response.ok) {
                    throw new Error("Error al eliminar el producto del carrito");
                }

                // Recargar la página para actualizar la vista
                window.location.reload();
            } catch (error) {
                console.error("Error al eliminar el producto del carrito:", error);
                alert("No se pudo eliminar el producto del carrito.");
            }
        }
    });

    // Vaciar el carrito
    const clearCartButton = document.getElementById("clear-cart");
    if (clearCartButton) {
        clearCartButton.addEventListener("click", async () => {
            const cartId = clearCartButton.getAttribute("data-cart-id");

            try {
                const response = await fetch(`/api/cart/${cartId}`, {
                    method: "DELETE",
                });

                if (!response.ok) {
                    throw new Error("Error al vaciar el carrito");
                }

                // Recargar la página para actualizar la vista
                window.location.reload();
            } catch (error) {
                console.error("Error al vaciar el carrito:", error);
                alert("No se pudo vaciar el carrito.");
            }
        });
    }
});