const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");


const app = express();

app.use(cors());
app.use(bodyParser.json());

const ListSchema = new mongoose.Schema({
    itemType:String,
    Quantity:Number,
    isPacked:Boolean
});

const Item = mongoose.model("Item", ListSchema)






app.get('/items', async (req,res,next) => 
    {
        const posts = await Item.find();
        res.json(posts);
        
        
    });

app.post('/items', (req,res,next) => 
    {
        const itemType = req.body.itemType;
        const quantity = req.body.quantity;
        const isPacked = req.body.isPacked;

        const item = new Item({
            itemType:itemType,
            Quantity:quantity,
            isPacked:isPacked
        });

        item.save()
        .then(savedItem => {
          res.status(201).json(savedItem); // Send the saved item data as a response
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ error: 'Failed to save item' });
        });
    });

    app.delete('/items/delete', async (req, res, next) => {
        try {
          const itemId = req.body.itemToDelete;
          console.log(itemId);
          const deletedItem = await Item.deleteOne({_id:itemId});
      
          if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found' });
          }
      
          res.status(200).json({ message: 'Item deleted successfully', deletedItem });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Failed to delete item' });
        }
      });
      
 

     

mongoose.connect("mongodb://localhost:27017/list_DB").then(result => {
    app.listen(8080, () => {
        console.log("Server is Running on Port 8080");
    });
}).catch(err => {
    console.log(err);
});