const productForm = document.getElementById('productForm');
const productList = document.getElementById('productList');
const socketClient = io();

// Función para renderizar la lista de productos
function renderProductList(products) {
  productList.innerHTML = '';

  products.forEach((product) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <div>
        <strong>Title:</strong> ${product.title}<br>
        <strong>Description:</strong> ${product.description}<br>
        <strong>Code:</strong> ${product.code}<br>
        <strong>Price:</strong> $${product.price.toFixed(2)}<br>
        <strong>Stock:</strong> ${product.stock}<br>
        <strong>Category:</strong> ${product.category}<br>
        <strong>Thumbnail:</strong> ${product.thumbnail}<br>
        <button onclick="deleteProduct(${product.id})">Delete</button>
      </div>
      <hr>
    `;
    productList.appendChild(listItem);
  });
}

// Escucha el evento para recibir la lista inicial de productos desde el servidor
socketClient.on('initialProductList', (products) => {
  renderProductList(products);
});

// Escucha el evento para recibir la lista actualizada de productos desde el servidor
socketClient.on('updatedProductList', (products) => {
  renderProductList(products);
});

// Escucha el evento para recibir la lista actualizada de productos desde el servidor
socketClient.on('productList', (products) => {
  renderProductList(products);
});

productForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const code = document.getElementById('code').value;
  const price = parseFloat(document.getElementById('price').value);
  const stock = parseInt(document.getElementById('stock').value);
  const category = document.getElementById('category').value;
  const thumbnail = document.getElementById('thumbnail').value;

  const productData = {
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnail
  };

  socketClient.emit('addProduct', productData);
});

// Función para eliminar un producto
function deleteProduct(productId) {
  socketClient.emit('deleteProduct', productId);
}