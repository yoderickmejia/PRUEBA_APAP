const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`[prueba-tecnica-apap] Servidor corriendo en puerto ${PORT}`);
  console.log(`[prueba-tecnica-apap] Entorno: ${process.env.NODE_ENV || 'development'}`);
});
