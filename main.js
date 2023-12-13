const fs = require("fs").promises;

class ProductManager {
    static ultId = 0;


//Array vacio.
    constructor(path) {
        this.products = [];
        this.path = path;
    }

//Métodos.
    async addProduct (nuevoObjeto) {
       let {title, description, price, img, code, stock} = nuevoObjeto; 


//Validamos todos los campos.
        if (!title || !description || !price || !img || !code || !stock) {
            console.log("Todos los campos son obligatorios!!!");
            return;
        }

//Validamos que el código sea único.
        if (this.products.some(item => item.code == code)){
            console.log("El codigo debe ser unico en el mundo");
            return;
        }

//Creamos un nuevo objeto con todos estos datos.
         const newProduct = {
            id: ++ProductManager.ultId,
            title,
            description,
            price,
            img,
            code,
            stock,
         }

         this.products.push(newProduct);


         //guardar el array en el archivo


         await this.guardarArchivos(this.products);

    }

    getProducts () {
        console.log(this.products);
    }

    async getProductsById(id) {
        try { 
            const arrayProductos = await this.leerArchivo();
            const buscado = arrayProductos.find(item => item.id === id);

            if(!buscado) {
                console.log("Producto no encontrado");
            }else {
                console.log("Si, producto encontrado");
                return buscado;
            }

        } catch (error) {
            console.log("Error al leer el archivo", error);
        }
    }

//metodos nuevos

    async leerArchivo() {
        try {
            const respuesta = await fs.readFile(this.path, "utf-8");
            const arrayProductos = JSON.parse(respuesta);
            return arrayProductos;
            
        } catch (error) {
            console.log("error al leer un archivo", error);
        }
    }

    async guardarArchivos(arrayProductos){
        try{
            await fs.writeFile(this.path, JSON.stringify (arrayProductos, null, 2));

        }  catch (error) {
            console.log("Error al guardar el archivo", error);
        }
    }
   
    async updateProduct(id, productoActualizado) {
        try {
            const arrayProductos = await this.leerArchivo();

            const index = arrayProductos.findIndex(item => item.id ===id);

            if(index !== -1) {
                arrayProductos.splice(index, 1, productoActualizado);
                await this.guardarArchivos(arrayProductos);
            } else{
                console.log("No se encontro el producto");
            }

        } catch (error) {
            console.log("Error al actualizar el producto", error);
        }
    }


    async deleteProductById(id) {
        const arrayProductos = await this.leerArchivo();

            const index = arrayProductos.findIndex(item => item.id === id);

            if (index !== -1) {
                arrayProductos.splice(index, 1);
                await this.guardarArchivos(arrayProductos);
                console.log('el producto a sido eliminado');
        
            } else {
                console.log("no se encontro el producto");
            }

        }catch (error) {
        console.log("Error al actualizar el producto", error); 
    }
        

}




//Testing

const manager = new ProductManager("./productos.json");

manager.getProducts();

const pelota = {
    title: "Pelota Basquet",
    description: "Pelota Molten N7",
    price: 60.000,
    img: "sin imagen",
    code: "abc123",
    stock: 10
}

manager.addProduct(pelota);

const remera = {
    title: "Remera deportiva",
    description: "Remera deportiva negra",
    price: 30.000,
    img: "sin imagen",
    code: "abc124",
    stock: 15
}

manager.addProduct(remera);

const buzo = {
    title: "Buzo",
    description: "Buzo blanco",
    price: 45.000,
    img: "sin imagen",
    code: "abc125",
    stock: 8
}

manager.addProduct(buzo);

manager.getProducts();



async function testeamosBusquedaPorId() {
    const buscado = await manager.getProductsById(2);
    console.log(buscado);
}

testeamosBusquedaPorId();

const arodebasquet = {
    id: 1,
    title: "Aro de basquet",
    description: "aro de basquet para exterior",
    price: 100.000,
    img: "sin imagen",
    code: "abc123",
    stock: 5
}

async function testeamosActualizar() {
    await manager.updateProduct(1, arodebasquet);
}

testeamosActualizar();

async function testeamosDeleteProduct () {
    await manager.deleteProductById(2);
}

testeamosDeleteProduct();