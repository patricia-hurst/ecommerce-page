let quantity = 0;
let cartQty = 0;
let modalTotal = 0;

const MODAL_EL = document.querySelector(".cart-modal");
const MODAL_BODY = document.querySelector(".modal-body");
const MODAL_EMPTY = document.querySelector(".cart-empty");
const OVERLAY = document.querySelector(".overlay");
const SIDE_MENU = document.querySelector(".side-menu");

//** add/remove/toggle any class on 1 or more elements **//
function modifyClass(action, className, ...elements) {
    if (action === "add") {
        elements.forEach((element) => element.classList.add(className));
    } else if (action === "remove") {
        elements.forEach((element) => element.classList.remove(className));
    } else if (action === "toggle") {
        elements.forEach((element) => element.classList.toggle(className));
    }
}

// ESCAPE FUNCTION - closes cart modal, side menu OR lightbox:
document.addEventListener("keyup", (e) => {
    if (e.key === "Escape") {
        if (!MODAL_EL.classList.contains("hidden")) {
            modifyClass("add", "hidden", MODAL_EL);
        } else if (!SIDE_MENU.classList.contains("hidden")) {
            modifyClass("add", "hidden", SIDE_MENU, OVERLAY);
        } else if (!LIGHTBOX.classList.contains("hidden")) {
            modifyClass("add", "hidden", LIGHTBOX, OVERLAY);
        } else {
            return;
        }
    }
});

// CLICK ON OVERLAY to close side menu OR lightbox:
OVERLAY.addEventListener("click", () => {
    if (!SIDE_MENU.classList.contains("hidden")) {
        modifyClass("add", "hidden", SIDE_MENU, OVERLAY);
    } else if (!LIGHTBOX.classList.contains("hidden")) {
        modifyClass("add", "hidden", LIGHTBOX, OVERLAY);
    }
});

// Turn off overlay if window resized > 769px (if overlay 'on' due to side menu being open)
window.matchMedia("(min-width: 769px)").addEventListener("change", (e) => {
    if (e.matches) {
        if (!OVERLAY.classList.contains("hidden")) {
            modifyClass("add", "hidden", OVERLAY);
        }
    }
});

// BURGER BUTTON - OPENS SIDE MENU:
document.querySelector(".menu").addEventListener("click", () => {
    modifyClass("toggle", "hidden", OVERLAY, SIDE_MENU);

    // needs to close the CART if open
    if (!MODAL_EL.classList.contains("hidden")) {
        MODAL_EL.classList.toggle("hidden");
    }
});

// CLOSE SIDE MENU ON X CLICK:
document.querySelector(".close-btn").addEventListener("click", () => {
    // prevent overlay from being toggled on if it's already off due to recent window resize(s)
    if (OVERLAY.classList.contains("hidden")) {
        modifyClass("toggle", "hidden", SIDE_MENU);
    } else {
        modifyClass("toggle", "hidden", OVERLAY, SIDE_MENU);
    }
});

// CHANGE ITEM QUANTITY:
document.querySelectorAll(".quantity-btn").forEach((el) => {
    el.addEventListener("click", () => {
        // change qty based on value of images' alt: plus or minus
        let n = el.alt;

        if (n === "plus") {
            quantity++;
        } else if (n === "minus" && quantity > 0) {
            quantity--;
        } else {
            // prevent quantity update if trying to go under 0
            return;
        }
        // update quantity #
        document.querySelector(".quantity").textContent = quantity;
    });
});

function updateCart() {
    if (cartQty === 0) {
        // if cart empty, switch to "cart is empty" modal content
        MODAL_BODY.classList.remove("flex");
        MODAL_BODY.classList.add("hidden");
        MODAL_EMPTY.classList.remove("hidden");
    } else {
        // cart isn't empty - display product info, update # values
        MODAL_BODY.classList.remove("hidden");
        MODAL_BODY.classList.add("flex");
        MODAL_EMPTY.classList.add("hidden");
        document.querySelector(".modal-qty").textContent = cartQty;
        let total = (cartQty * 125).toFixed(2);
        document.querySelector(".modal-total").textContent = `$${total}`;
    }
}

// ADD TO CART BUTTON - UPDATES CART QTY:
document.querySelector(".cart-btn").addEventListener("click", () => {
    cartQty += quantity;
    document.querySelector(".nav-cart-qty").textContent = cartQty;
    console.log(`total in cart: ${cartQty}`);
    updateCart();
});

// CLICK CART DELETE BUTTON:
document.querySelector(".delete-btn").addEventListener("click", () => {
    cartQty = 0;
    modalTotal = 0;
    document.querySelector(".nav-cart-qty").textContent = cartQty;
    updateCart();
});

// CLICK CART BUTTON - toggles cart modal:
document.querySelector(".nav-cart-ctn").addEventListener("click", () => {
    modifyClass("toggle", "hidden", MODAL_EL);
    // updates product info if "add to cart" clicked while cart open
    updateCart();
});

// MAIN PRODUCT IMAGES SLIDESHOW:
let slideIndex = 1;
showSlides(slideIndex);

function showSlides(n) {
    let slides = document.getElementsByClassName("slides");
    // array of the 4 images

    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }

    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex - 1].style.display = "block";
}

// IMAGE SLIDESHOW - 'PREVIOUS' ARROW BUTTON:
document.querySelector(".previous").addEventListener("click", () => {
    console.log("Clicked previous");
    showSlides(--slideIndex);
    console.log(slideIndex);
});

// IMAGE SLIDESHOW - 'NEXT' ARROW BUTTON:
document.querySelector(".next").addEventListener("click", () => {
    console.log("clicked next");
    showSlides(++slideIndex);
    console.log(slideIndex);
});

// THUMBNAIL IMAGE CLICK (image swap):
document.querySelectorAll(".thumbnail").forEach((el) => {
    el.addEventListener("click", () => {
        let elImgSrc = el.getAttribute("src");
        console.log(elImgSrc);
        // removes `-thumbnail.jpg` from thumbnail src, add back on .jpg
        // matches the full size image src
        let swapSrc = `${elImgSrc.slice(0, 22)}.jpg`;
        document.querySelector(".primary").src = swapSrc;
    });
});

// TESTING lightbox product modal
const LIGHTBOX = document.querySelector(".product-modal");

document.querySelector(".primary").addEventListener("click", () => {
    modifyClass("toggle", "hidden", LIGHTBOX, OVERLAY);
});
