import mongoose from "mongoose";

export const connectMongoDB = async () => {
  try {
    // Usa el URI de la base de datos desde las variables de entorno
    const uri = process.env.MONGO_URI || 
      'mongodb+srv://carlosvasquezjones:fJsfD6dZHNxYJbxJ@cluster0.9fghh.mongodb.net/e-commerce?retryWrites=true&w=majority';

    // Conectar a la base de datos MongoDB
    await mongoose.connect(uri);

    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Finaliza el proceso si la conexión falla
  }
};


