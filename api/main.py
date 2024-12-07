from datetime import datetime
from fastapi import FastAPI, Request, Response
from utils import get_log_level
from controllers.vagas_controller import router as vagas_router
from fastapi.middleware.cors import CORSMiddleware
import logging

app = FastAPI()

origins = [
    "http://localhost:4200",
    "*"
]

logging.basicConfig(
    filename="logs.log",
    level=logging.DEBUG, # Todos os níveis
    format="%(asctime)s - %(levelname)s - %(message)s",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Zip-File-Hash"]
)

app.include_router(vagas_router, prefix="/vagas", tags=["Vaga"])

@app.middleware("http")
async def log(request: Request, call_next):
    start_time = datetime.now()
    method = request.method
    path = request.url.path

    response: Response = await call_next(request)
    status_code = response.status_code

    log_level = get_log_level(status_code)
    logging.log(log_level, f"Metodo: {method} | Caminho: {path} | Status: {status_code} | Data/Hora: {start_time}")

    return response

@app.get("/")
def root():
    return {"message": "API de catálogo de Vaga"}
