# Microservicio de Pedidos

API REST para gestión de pedidos construida con FastAPI y SQLite.

## Requisitos previos

- [Python 3.8+](https://www.python.org/downloads/)
- [Git](https://git-scm.com/)

## Instalación y ejecución

**1. Clonar el repositorio**
```bash
git clone https://github.com/CarlosYesid27/Microservicio_pedidos.git
cd Microservicio_pedidos
```

**2. Crear y activar el entorno virtual**

Windows:
```bash
python -m venv .venv
.venv\Scripts\activate
```

Mac/Linux:
```bash
python3 -m venv .venv
source .venv/bin/activate
```

**3. Instalar las dependencias**
```bash
pip install -r requirements.txt
```

**4. Ejecutar el servidor**
```bash
uvicorn main:app --reload
```

**5. Abrir en el navegador**

- Aplicación: http://localhost:8000
- Documentación interactiva (Swagger): http://localhost:8000/docs

> La base de datos SQLite se crea automáticamente al primer arranque.
