import { serve } from "bun";
import { Database } from "bun:sqlite";
import { mkdir } from "node:fs/promises";

// Asegurarnos que el directorio de datos existe
try {
  await mkdir("./data");
} catch {
  // El directorio ya existe
}

// Inicializar base de datos SQLite
const db = new Database("./data/test.db");
db.run(`
  CREATE TABLE IF NOT EXISTS metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT,
    value TEXT
  )
`);

// Datos de ejemplo para procesamiento JSON
const complexData = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  data: {
    name: "test" + i,
    values: Array.from({ length: 100 }, (_, j) => ({ sub: j, calc: Math.random() }))
  }
}));

const server = serve({
  port: 3000,
  async fetch(request) {
    const start = performance.now();
    
    try {
      // 1. Operación de archivo
      const fileData = JSON.stringify(complexData);
      await Bun.write("./data/temp_data.json", fileData);
      const readData = await Bun.file("./data/temp_data.json").text();
      
      // 2. Query a base de datos
      const timestamp = new Date().toISOString();
      db.run("INSERT INTO metrics (timestamp, value) VALUES (?, ?)", [timestamp, "test"]);
      const dbResults = db.query("SELECT * FROM metrics ORDER BY id DESC LIMIT 5").all();
      
      // 3. Procesamiento JSON complejo
      const processedData = JSON.parse(readData).map((item: any) => {
        return {
          ...item,
          data: {
            ...item.data,
            values: item.data.values.map((v: any) => ({
              ...v,
              processed: Math.pow(v.calc, 2) * Math.sin(v.sub)
            }))
          }
        };
      });
      
      // 4. Operaciones criptográficas
      const textEncoder = new TextEncoder();
      const data = textEncoder.encode(JSON.stringify(processedData));
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      const end = performance.now();
      const duration = end - start;

      // Limpiar archivo temporal
      try {
        await Bun.file("./data/temp_data.json").delete();
      } catch {
        // Ignorar errores al limpiar
      }

      return new Response(
        JSON.stringify({
          message: "Operaciones completadas en Bun",
          duration: `${duration.toFixed(2)}ms`,
          hash: hashHex,
          dbRowCount: dbResults.length,
          dataProcessed: processedData.length,
          runtime: "Bun"
        }),
        {
          headers: { "content-type": "application/json" },
          status: 200,
        },
      );
    } catch (error) {
      console.error("Error en Bun:", error);
      return new Response(
        JSON.stringify({
          error: error.message,
          duration: `${(performance.now() - start).toFixed(2)}ms`,
          runtime: "Bun"
        }),
        {
          headers: { "content-type": "application/json" },
          status: 500,
        },
      );
    }
  },
});

console.log("Servidor Bun iniciado en http://localhost:3000"); 