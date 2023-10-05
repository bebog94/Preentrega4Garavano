import express  from "express";
import  {engine}  from "express-handlebars";
import { Server } from "socket.io";
import homeRoutes from './routes/homeRoutes.js';
import realTimeProductsRoutes from './routes/realTimeProductsRoutes.js';
import {__dirname} from './utils.js';
import { manager } from './ProductManager.js';



const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname+'/public'))


//handlebars
app.engine('handlebars',engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");



//routes
app.use('/', homeRoutes);
app.use('/realtimeproducts', realTimeProductsRoutes);



const port = 8080

const httpServer = app.listen(port, () => {
    console.log(`Escuchando al puerto ${port}`);
  });



  const socketServer = new Server(httpServer);

  socketServer.on('connection', async (socket) => {
    console.log('Cliente conectado');
    socket.emit('initialProductList', manager.getProducts());
  
    try {
      const products = await manager.getProducts();
      socket.emit('productList', products);
      console.log('Productos enviados:', products);
    } catch (error) {
      console.error('Error al obtener la lista de productos:', error);
    }
    socket.on('addProduct', (productData) => {
      try {
        const newProduct = manager.addProduct(productData);
        // Enviar la lista actualizada de productos a todos los clientes
        socketServer.emit('updatedProductList', manager.getProducts());
      } catch (error) {
        console.error('Error al agregar producto:', error.message);
      }
    });
    socket.on('deleteProduct', (productId) => {
      try {
        manager.deleteProduct(productId);
        
        socketServer.emit('updatedProductList', manager.getProducts());
      } catch (error) {
        console.error('Error al eliminar producto:', error.message);
      }
    });


  });
export default app;