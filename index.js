const fn = {
    modifyClass(action, className, ...els) {
        if (action === "add") {
            els.forEach((el) => el.classList.add(className));
        } else if (action === "remove") {
            els.forEach((el) => el.classList.remove(className));
        } else if (action === "toggle") {
            els.forEach((el) => el.classList.toggle(className));
        }
    },

    toggleSideMenu(e) {
        let eTar = e.target;
        if (!eTar.matches("img")) return;

        // open side menu:
        if (eTar.classList.contains("menu")) {
            if (cartOpen === true) {
                // close cart if open
                fn.modifyClass("toggle", "hidden", el.cart_modal);
                cartOpen = false;
            }
            fn.modifyClass("toggle", "hidden", el.overlay, el.side_menu);
            sidemenuOpen = true;
            // close side menu:
        } else if (eTar.classList.contains("close-btn")) {
            el.overlay.classList.contains("hidden")
                ? fn.modifyClass("toggle", "hidden", el.side_menu)
                : fn.modifyClass("toggle", "hidden", el.overlay, el.side_menu);
            sidemenuOpen = false;
        }
    },

    updateCounter(e) {
        let eTar = e.target;

        if (eTar.classList.contains("plus")) {
            counter++;
            document.querySelector(".counter").textContent = counter;
        } else if (eTar.classList.contains("minus") && counter > 1) {
            // don't let counter go below 1
            counter--;
            document.querySelector(".counter").textContent = counter;
        } else if (eTar.classList.contains("cart-btn")) {
            cartQty += counter;
            // update cart qty state / visual:
            el.nav_cart_qty.textContent = cartQty;
            fn.modifyClass("remove", "hidden", el.nav_cart_qty);
            console.log(`total in cart: ${cartQty}`);
            fn.updateCart();
        }
    },

    updateCart() {
        if (cartQty === 0) {
            // if cart empty, switch to "cart is empty" modal content
            el.cart_modal_body.classList.remove("flex");
            el.cart_modal_body.classList.add("hidden");
            el.cart_modal_empty.classList.remove("hidden");
        } else {
            // cart isn't empty - display product info, update # values
            el.cart_modal_body.classList.remove("hidden");
            el.cart_modal_body.classList.add("flex");
            el.cart_modal_empty.classList.add("hidden");
            document.querySelector(".modal-qty").textContent = cartQty;
            let total = (cartQty * 125).toFixed(2);
            document.querySelector(".modal-total").textContent = `$${total}`;
        }
    },

    handleLightboxClicks(e) {
        let tar = e.target;
        if (!tar.matches("img")) return;

        if (tar.classList.contains("primary-next")) {
            fn.showSlides(++slideIndex, el.primary_slides);
        } else if (tar.classList.contains("primary-previous")) {
            fn.showSlides(--slideIndex, el.primary_slides);
        } else if (tar.classList.contains("lb-next")) {
            fn.showSlides(++slideIndex, el.lightbox_slides);
        } else if (tar.classList.contains("lb-previous")) {
            fn.showSlides(--slideIndex, el.lightbox_slides);
        } else if (tar.classList.contains("lb-close")) {
            fn.modifyClass("toggle", "hidden", el.lightbox, el.overlay);
            lightboxOpen = false;
        }
    },

    showSlides(n, slideArr) {
        if (n > slideArr.length) {
            slideIndex = 1;
        } else if (n < 1) {
            slideIndex = slideArr.length;
        }

        for (let i = 0; i < slideArr.length; i++) {
            slideArr[i].style.display = "none";
        }
        slideArr[slideIndex - 1].style.display = "block";
    },
};

const el = {
    cart_modal: document.querySelector(".cart-modal"),
    cart_modal_body: document.querySelector(".modal-body"),
    cart_modal_empty: document.querySelector(".cart-empty"),
    nav_cart_qty: document.querySelector(".nav-cart-qty"),
    overlay: document.querySelector(".overlay"),
    side_menu: document.querySelector(".side-menu"),
    primary_slides: document.getElementsByClassName("slides"),
    lightbox_slides: document.getElementsByClassName("lb-slides"),
    lightbox: document.querySelector(".lightbox"),
};

let lightboxOpen = false;
let cartOpen = false;
let sidemenuOpen = false;
let counter = 1;
let cartQty = 0;
let slideIndex = 1;

// Initialize slides:
fn.showSlides(slideIndex, el.primary_slides);
fn.showSlides(slideIndex, el.lightbox_slides);

let initializeSlides = (el) => {
    slideIndex = 1;
    fn.showSlides(slideIndex, el);
};

// ESCAPE FUNCTION - closes cart modal, side menu OR lightbox:
document.addEventListener("keyup", (e) => {
    if (e.key === "Escape") {
        if (cartOpen === true) {
            fn.modifyClass("toggle", "hidden", el.cart_modal);
            cartOpen = false;
        } else if (sidemenuOpen === true) {
            fn.modifyClass("add", "hidden", el.side_menu, el.overlay);
            sidemenuOpen = false;
        } else if (lightboxOpen === true) {
            fn.modifyClass("add", "hidden", el.lightbox, el.overlay);
            lightboxOpen = false;
        } else {
            return;
        }
    }
});

// CLICK ON OVERLAY to close side menu:
el.overlay.addEventListener("click", () => {
    if (sidemenuOpen === true) {
        fn.modifyClass("add", "hidden", el.side_menu, el.overlay);
    }
});

// WINDOW RESIZED > 769px, reset slideshow, turn off side menu/overlay if open:
window.matchMedia("(min-width: 769px)").addEventListener("change", (e) => {
    if (e.matches) {
        initializeSlides(el.primary_slides);

        // close the side menu/overlay if open:
        if (sidemenuOpen === true) {
            fn.modifyClass("toggle", "hidden", el.side_menu, el.overlay);
            sidemenuOpen = false;
        }
    }
});

// WINDOW RESIZED < 769px, reset slideshow / turn off lightbox:
window.matchMedia("(max-width: 768px)").addEventListener("change", (e) => {
    if (e.matches) {
        initializeSlides(el.primary_slides);

        // turn off lightbox:
        if (lightboxOpen === true) {
            fn.modifyClass("toggle", "hidden", el.lightbox, el.overlay);
            lightboxOpen = false;
        }
    }
});

// OPEN & CLOSE SIDE MENU:
document.querySelector(".nav").addEventListener("click", (e) => {
    fn.toggleSideMenu(e);
});

// UPDATE CART (counter / add to cart button):
document.querySelector(".cart").addEventListener("click", (e) => {
    fn.updateCounter(e);
});

// OPEN CART:
document.querySelector(".nav-cart-ctn").addEventListener("click", () => {
    fn.modifyClass("toggle", "hidden", el.cart_modal);
    // updates product info if "add to cart" clicked while cart open
    fn.updateCart();
    cartOpen = true;
});

// CLICK CART DELETE BUTTON:
document.querySelector(".delete-btn").addEventListener("click", () => {
    cartQty = 0;
    fn.modifyClass("add", "hidden", el.nav_cart_qty);
    fn.updateCart();
    cartOpen = false;
});

// PRIMARY IMAGE - SWAP IMAGE ON THUMBNAIL CLICK:
document.querySelectorAll(".thumbnail").forEach((thumbnail) => {
    thumbnail.addEventListener("click", () => {
        console.log("thumbnail clicked");
        let elImgSrc = thumbnail.getAttribute("src");
        let swapSrc = `${elImgSrc.slice(0, elImgSrc.length - 14)}.jpg`;
        document.querySelector(".primary").src = swapSrc;
    });
});

// OPEN LIGHTBOX:
document.querySelector(".primary").addEventListener("click", () => {
    if (window.innerWidth < 769) return; // prevent opening lightbox at mobile sizes
    // close cart modal if open:
    if (cartOpen === true) {
        fn.modifyClass("toggle", "hidden", el.cart_modal);
        cartOpen = false;
    }

    initializeSlides(el.lightbox_slides);
    fn.modifyClass("toggle", "hidden", el.lightbox, el.overlay);
    lightboxOpen = true;
});

// LIGHTBOX ARROWS + X (CLOSE):
document.querySelector("main").addEventListener("click", (e) => {
    fn.handleLightboxClicks(e);
});
