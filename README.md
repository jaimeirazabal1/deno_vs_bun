# Deno vs Bun: Comparación de Rendimiento 🚀

Este repositorio contiene una comparación de rendimiento entre Deno y Bun, dos runtimes modernos para JavaScript/TypeScript.

## 🎯 Objetivo

Comparar el rendimiento de Deno y Bun en condiciones reales, incluyendo:
- Operaciones de archivo
- Consultas a base de datos
- Procesamiento JSON
- Operaciones criptográficas

## 🛠️ Requisitos

- Docker y Docker Compose
- Node.js (para Artillery)
- Artillery (`npm install -g artillery`)

## 🚀 Cómo usar

1. Clona el repositorio:
```bash
git clone https://github.com/jaimeirazabal1/deno_vs_bun
cd deno-bun-comparison
```

2. Inicia los servicios:
```bash
docker-compose up -d
```

3. Ejecuta las pruebas:
```bash
chmod +x test-performance-artillery.sh
./test-performance-artillery.sh
```

## 📊 Resultados

Los resultados se guardarán en el directorio `artillery-results/` y podrás ver:
- Latencia (p50, p95, p99)
- RPS (Requests Per Second)
- Tasa de error
- Gráficos de rendimiento

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Si tienes sugerencias para mejorar las pruebas o quieres agregar más métricas, abre un issue o envía un pull request.

## 📝 Licencia

MIT

## 🙏 Agradecimientos

- [Deno](https://deno.land/)
- [Bun](https://bun.sh/)
- [Artillery](https://artillery.io/) 
