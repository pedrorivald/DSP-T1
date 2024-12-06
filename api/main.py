from fastapi import FastAPI
from controllers.vagas_controller import router as vagas_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:4200",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Permite esses domínios
    allow_credentials=True, # Permite o envio de cookies e headers de autenticação
    allow_methods=["*"],    # Permite todos os métodos HTTP (GET, POST, etc.)
    allow_headers=["*"],    # Permite todos os cabeçalhos
    expose_headers=["Zip-File-Hash"]
)

app.include_router(vagas_router, prefix="/vagas", tags=["Vaga"])

@app.get("/")
def root():
    return {"message": "API de catálogo de Vaga"}
