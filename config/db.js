const mongoose = require('mongoose');



const connectDb = async() =>{
      try {
        await mongoose.connect("mongodb+srv://buttehtesham86:dbottomon123@dbottomon.aetwhlx.mongodb.net/",{
            useNewUrlParser:true,
            useUnifiedTopology:true
        });
        console.log('database connection established')
      } catch (error) {
        console.error('error connecting to database', error.message);
        process.exit(1);
      }
}

module.exports= connectDb;