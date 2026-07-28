document.addEventListener("DOMContentLoaded", () => {
    const cartButtons = document.querySelectorAll(".pro .cart");
    const shopNowButton = document.querySelector("#hero button");
    const exploreButton = document.querySelector("#banner .normal");
    const navbarCart = document.querySelector(
        '#navbar a[href="cart.html"]'
    );

    /*
     * Load the cart from the browser.
     * If no cart exists yet, begin with an empty array.
     */
    let cart = JSON.parse(localStorage.getItem("minaCart")) || [];

    function saveCart() {
        localStorage.setItem("minaCart", JSON.stringify(cart));
        updateCartIcon();
    }

    function updateCartIcon() {
        if (!navbarCart) {
            return;
        }

        const totalItems = cart.reduce(
            (total, item) => total + item.quantity,
            0
        );

        navbarCart.title =
            totalItems === 0
                ? "Your cart is empty"
                : `Cart: ${totalItems} item(s)`;
    }

    function addProductToCart(productCard) {
        const nameElement = productCard.querySelector("h3");
        const priceElement = productCard.querySelector(".harga h4");
        const imageElement = productCard.querySelector("img");
        const categoryElement = productCard.querySelector(".des span");

        if (!nameElement || !priceElement || !imageElement) {
            console.error("This product card is missing information.");
            return;
        }

        const product = {
            name: nameElement.textContent.trim(),
            price: Number(
                priceElement.textContent.replace(/[^0-9.]/g, "")
            ),
            image: imageElement.getAttribute("src"),
            category: categoryElement
                ? categoryElement.textContent.trim()
                : "Fashion",
            quantity: 1
        };

        /*
         * Image paths are used as temporary product IDs because some
         * products currently have the same name and price.
         */
        const existingProduct = cart.find(
            (item) => item.image === product.image
        );

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push(product);
        }

        saveCart();

        alert(`${product.name} was added to your cart!`);
    }

    cartButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();

            const productCard = button.closest(".pro");

            if (productCard) {
                addProductToCart(productCard);
            }
        });
    });

    /*
     * Scroll to the Hot-Selling section when SHOP NOW is clicked.
     */
    if (shopNowButton) {
        shopNowButton.addEventListener("click", () => {
            document.querySelector("#hotsell")?.scrollIntoView({
                behavior: "smooth"
            });
        });
    }

    /*
     * Scroll to New Arrivals when Explore More is clicked.
     */
    if (exploreButton) {
        exploreButton.addEventListener("click", () => {
            document.querySelector("#new")?.scrollIntoView({
                behavior: "smooth"
            });
        });
    }

    updateCartIcon();

    const cartItemsContainer = document.querySelector("#cart-items");
    const cartTotalElement = document.querySelector("#cart-total");
    const clearCartButton = document.querySelector("#clear-cart");
    const checkoutButton = document.querySelector("#checkout-button");

    function renderCartPage() {
        if (!cartItemsContainer || !cartTotalElement) {
            return;
        }

        cartItemsContainer.innerHTML = "";

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <p>Your cart is currently empty.</p>
                <a href="index.html">Continue shopping</a>
            `;

            cartTotalElement.textContent = "$0.00";
            return;
        }

        let total = 0;

        cart.forEach((item, index) => {
            total += item.price * item.quantity;

            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");

            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">

                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>${item.category}</p>
                    <p>$${item.price.toFixed(2)}</p>

                    <div class="cart-quantity">
                        <button
                            class="decrease-quantity"
                            data-index="${index}"
                            type="button"
                        >
                            -
                        </button>

                        <span>${item.quantity}</span>

                        <button
                            class="increase-quantity"
                            data-index="${index}"
                            type="button"
                        >
                            +
                        </button>
                    </div>

                    <button
                        class="remove-item"
                        data-index="${index}"
                        type="button"
                    >
                        Remove
                    </button>
                </div>
            `;

            cartItemsContainer.appendChild(cartItem);
        });

        cartTotalElement.textContent = `$${total.toFixed(2)}`;

        document.querySelectorAll(".increase-quantity").forEach((button) => {
            button.addEventListener("click", () => {
                const index = Number(button.dataset.index);

                cart[index].quantity += 1;
                saveCart();
                renderCartPage();
            });
        });

        document.querySelectorAll(".decrease-quantity").forEach((button) => {
            button.addEventListener("click", () => {
                const index = Number(button.dataset.index);

                cart[index].quantity -= 1;

                if (cart[index].quantity <= 0) {
                    cart.splice(index, 1);
                }

                saveCart();
                renderCartPage();
            });
        });

        document.querySelectorAll(".remove-item").forEach((button) => {
            button.addEventListener("click", () => {
                const index = Number(button.dataset.index);

                cart.splice(index, 1);
                saveCart();
                renderCartPage();
            });
        });
    }

    if (clearCartButton) {
        clearCartButton.addEventListener("click", () => {
            cart = [];
            saveCart();
            renderCartPage();
        });
    }

    if (checkoutButton) {
        checkoutButton.addEventListener("click", () => {
            if (cart.length === 0) {
                alert("Your cart is empty.");
                return;
            }

            alert(
                "Demo checkout completed. No payment was processed."
            );

            cart = [];
            saveCart();
            renderCartPage();
        });
    }

    renderCartPage();
});