const URL_API = `http://localhost:3000/agriculturalProducts`;
const URL_API_FAVORITES = `http://localhost:3000/favorite`;
const sectionProducts = document.querySelector(".section-products");
const favCountElement = document.getElementById('fav-count');
const btnDetails = document.querySelector("#button-card-product");

document.addEventListener('DOMContentLoaded', () => {
    updateFavoritesCount();
});

async function index(sectionProducts) {
    const response = await fetch(URL_API);
    const products = await response.json();

    products.forEach(product => {
        sectionProducts.innerHTML += `
            <div class="card-product">
                <div class="face-card front-card">
                    <img class="img-card-product" src="${product.linkProductImage}" alt="">
                    <h3 class="h3-card-product">${product.productName}</h3>
                </div>
                <div class="face-card back-card" id="info-back-product">
                        <div>
                            <h3 class="h3-card-product" id="h3-card-product">${product.productName}</h3>
                            <p class="p-card-product">${product.productDescription}</p>
                        </div>
                        <div class="price-info">
                            <h3 class="h3-card-product"><span>$ </span>${product.productPrice}<span> COP </span></h3>
                            <p class="p-card-product">Kilo</p>
                        </div>
                        <div class="price-info">
                            <button class="details-btn button-card-product"
                                data-product='${JSON.stringify(product)}'><b>Detalles</b></button>
                        </div>
                </div>
            </div>
        `;
    });

    document.querySelectorAll('.details-btn').forEach(button => {
        button.addEventListener('click', function () {
            const product = JSON.parse(this.getAttribute('data-product'));
            document.getElementById('modal-product-image').src = product.linkProductImage;
            document.getElementById('modal-product-name').innerText = product.productName;
            document.getElementById('modal-product-description').innerText = product.productDescription;
            document.getElementById('modal-product-price').innerText = `$ ${product.productPrice} COP`;
            document.getElementById('modal-owner-name').innerText = product.ownerAgricola.ownerName;
            document.getElementById('modal-owner-lastname').innerText = product.ownerAgricola.ownerLastName;
            document.getElementById('modal-owner-town').innerText = product.ownerAgricola.ownerTown;

            document.querySelector('#ul-contact-owner a[href^="mailto:"]').href = `mailto:${product.ownerAgricola.ownerEmail}`;
            document.querySelector('#ul-contact-owner a[href^="tel:"]').href = `tel:${product.ownerAgricola.ownerPhoneNumber}`;
            document.querySelector('#ul-contact-owner a[href^="https://wa.me/"]').href = `https://wa.me/${product.ownerAgricola.ownerNumberWhatsapp}`;

            const myModal = new bootstrap.Modal(document.getElementById('product-modal'));
            myModal.show();

            document.getElementById('button-card-product').onclick = function() {
                addToFavorites(product);
            };
        });
    });
}

async function updateFavoritesCount() {
    const response = await fetch(URL_API_FAVORITES);
    const favorite = await response.json();
    favCountElement.innerText = favorite.length;
}

async function addToFavorites(product) {
    const response = await fetch(URL_API_FAVORITES);
    const favorite = await response.json();

    let productExist = false;

    for (let i = 0; i < favorite.length; i++) {
        if (favorite[i].id === product.id) {
            productExist = true;
            alert(`El producto ${favorite[i].productName} ya existe en favoritos`);
            break;
        }
    }
    if (!productExist) {
        await fetch(URL_API_FAVORITES, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });
        updateFavoritesCount(); // Actualizamos el contador después de agregar a favoritos
    }
}

index(sectionProducts);
