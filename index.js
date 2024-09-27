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

    thumbnailSwap() {
        document.querySelectorAll(".thumbnail").forEach((thumbnail) => {
            thumbnail.addEventListener("click", () => {
                // fn.swapImgSrc(thumbnail, ".primary");
                let elImgSrc = thumbnail.getAttribute("src");
                let swapSrc = `${elImgSrc.slice(0, elImgSrc.length - 14)}.jpg`;
                document.querySelector(".primary").src = swapSrc;
            });
        });
    },
};

const el = {
    cart_modal: document.querySelector(".cart-modal"),
    cart_modal_body: document.querySelector(".modal-body"),
    cart_modal_empty: document.querySelector(".cart-empty"),
    overlay: document.querySelector(".overlay"),
    side_menu: document.querySelector(".side-menu"),
    primary_slides: document.getElementsByClassName("slides"),
    lightbox_slides: document.getElementsByClassName("lb-slides"),
    lightbox: document.querySelector(".lightbox"),
};

let counter = 0;
let cartQty = 0;
let slideIndex = 1;

// ESCAPE FUNCTION - closes cart modal, side menu OR lightbox:
document.addEventListener("keyup", (e) => {
    if (e.key === "Escape") {
        if (!el.cart_modal.classList.contains("hidden")) {
            fn.modifyClass("add", "hidden", el.cart_modal);
        } else if (!el.side_menu.classList.contains("hidden")) {
            fn.modifyClass("add", "hidden", el.side_menu, el.overlay);
        } else if (!el.lightbox.classList.contains("hidden")) {
            fn.modifyClass("add", "hidden", el.lightbox, el.overlay);
        } else {
            return;
        }
    }
});

// CLICK ON OVERLAY to close side menu OR lightbox:
el.overlay.addEventListener("click", () => {
    if (!el.side_menu.classList.contains("hidden")) {
        fn.modifyClass("add", "hidden", el.side_menu, el.overlay);
    } else if (!el.lightbox.classList.contains("hidden")) {
        fn.modifyClass("add", "hidden", el.lightbox, el.overlay);
    }
});

// TURN OFF OVERLAY if window resized > 769px:
window.matchMedia("(min-width: 769px)").addEventListener("change", (e) => {
    if (e.matches) {
        // reset slideshow:
        slideIndex = 1;
        fn.showSlides(slideIndex, el.primary_slides);

        // turn off overlay if it was open:
        if (!el.overlay.classList.contains("hidden")) {
            fn.modifyClass("add", "hidden", el.overlay);
        }
    }
});

// OPEN & CLOSE SLIDE MENU:
document.querySelector(".nav").addEventListener("click", (e) => {
    let eTar = e.target;
    if (!eTar.matches("img")) return;

    if (eTar.classList.contains("menu")) {
        fn.modifyClass("toggle", "hidden", el.overlay, el.side_menu);

        if (!el.cart_modal.classList.contains("hidden")) {
            el.cart_modal.classList.toggle("hidden");
        }
    } else if (eTar.classList.contains("close-btn")) {
        el.overlay.classList.contains("hidden")
            ? fn.modifyClass("toggle", "hidden", el.side_menu)
            : fn.modifyClass("toggle", "hidden", el.overlay, el.side_menu);
    }
});

// UPDATE CART (counter / add to cart button):
document.querySelector(".cart").addEventListener("click", (e) => {
    let eTar = e.target;

    if (eTar.classList.contains("plus")) {
        counter++;
        document.querySelector(".counter").textContent = counter;
    } else if (eTar.classList.contains("minus") && counter > 0) {
        counter--;
        document.querySelector(".counter").textContent = counter;
    } else if (eTar.classList.contains("cart-btn")) {
        cartQty += counter;
        document.querySelector(".nav-cart-qty").textContent = cartQty;
        console.log(`total in cart: ${cartQty}`);
        fn.updateCart();
    }
});

// OPEN CART:
document.querySelector(".nav-cart-ctn").addEventListener("click", () => {
    fn.modifyClass("toggle", "hidden", el.cart_modal);
    // updates product info if "add to cart" clicked while cart open
    fn.updateCart();
});

// CLICK CART DELETE BUTTON:
document.querySelector(".delete-btn").addEventListener("click", () => {
    cartQty = 0;
    document.querySelector(".nav-cart-qty").textContent = cartQty;
    fn.updateCart();
});

// Initialize slides:
fn.showSlides(slideIndex, el.primary_slides);
fn.showSlides(slideIndex, el.lightbox_slides);

// OPEN LIGHTBOX:
document.querySelector(".primary").addEventListener("click", () => {
    if (window.innerWidth < 769) return; // prevent opening lightbox at mobile sizes
    fn.modifyClass("toggle", "hidden", el.lightbox, el.overlay);
});

// SLIDESHOW ARROWS:
document.querySelector("main").addEventListener("click", (e) => {
    let eTar = e.target;
    if (!eTar.matches("img")) return;

    if (eTar.classList.contains("primary-next")) {
        fn.showSlides(++slideIndex, el.primary_slides);
    } else if (eTar.classList.contains("primary-previous")) {
        fn.showSlides(--slideIndex, el.primary_slides);
    } else if (eTar.classList.contains("lb-next")) {
        fn.showSlides(++slideIndex, el.lightbox_slides);
    } else if (eTar.classList.contains("lb-previous")) {
        fn.showSlides(--slideIndex, el.lightbox_slides);
    } else if (eTar.classList.contains("thumbnail")) {
        fn.thumbnailSwap();
    }
});

