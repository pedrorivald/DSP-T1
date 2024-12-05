from fastapi import FastAPI
from controllers.vagas_controller import router as vagas_router
app = FastAPI()

app.include_router(vagas_router, prefix="/vagas", tags=["Vaga"])

@app.get("/")
def root():
    return {"message": "API de catálogo de Vaga"}
