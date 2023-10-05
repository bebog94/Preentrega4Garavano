const socketClient = io();

socketClient.on('productList', async (productsPromise) => {
    try {
      const products = await productsPromise;
      console.log('Productos recibidos:', products);
  
      const productList = document.getElementById('productList');
      productList.innerHTML = ' ';
  
      products.forEach((product) => {
        const listItem = document.createElement('li');
        listItem.textContent = `
          Title: ${product.title},
          
          Description: ${product.description},

          Price: ${product.price},

          Category: ${product.category},

          Thumbnail: ${product.thumbnail},

          Code: ${product.code},

          Stock: ${product.stock}
        `;
        productList.appendChild(listItem);
      });
    } catch (error) {
      console.error('Error al recibir la lista de productos:', error);
    }
  });