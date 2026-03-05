import sqlite3
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

app = FastAPI(title="Microservicio Pedidos")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_FILE = "pedidos.db"


def init_db():
    with sqlite3.connect(DB_FILE) as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS pedidos (
                id          INTEGER PRIMARY KEY,
                id_usuario  INTEGER NOT NULL,
                id_producto INTEGER NOT NULL,
                cantidad    INTEGER NOT NULL,
                estado      TEXT    NOT NULL
            )
        """)
        conn.commit()


def get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn


init_db()



class Pedido(BaseModel):
    id: int
    id_usuario: int
    id_producto: int
    cantidad: int
    estado: str


@app.get("/api/pedidos")
def listar_pedidos():
    with get_conn() as conn:
        rows = conn.execute("SELECT * FROM pedidos ORDER BY id").fetchall()
    return [dict(row) for row in rows]


@app.post("/api/pedidos", status_code=201)
def crear_pedido(pedido: Pedido):
    try:
        with get_conn() as conn:
            conn.execute(
                "INSERT INTO pedidos (id, id_usuario, id_producto, cantidad, estado) "
                "VALUES (?, ?, ?, ?, ?)",
                (pedido.id, pedido.id_usuario, pedido.id_producto,
                 pedido.cantidad, pedido.estado),
            )
            conn.commit()
    except sqlite3.IntegrityError:
        raise HTTPException(
            status_code=409,
            detail=f"El ID {pedido.id} ya existe. Use un ID diferente.",
        )
    return pedido


@app.delete("/api/pedidos/{pedido_id}", status_code=204)
def eliminar_pedido(pedido_id: int):
    with get_conn() as conn:
        result = conn.execute("DELETE FROM pedidos WHERE id = ?", (pedido_id,))
        conn.commit()
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Pedido no encontrado.")



app.mount("/", StaticFiles(directory=".", html=True), name="static")
