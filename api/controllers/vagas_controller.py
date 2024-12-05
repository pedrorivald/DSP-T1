import os
from fastapi import APIRouter, HTTPException, Query, BackgroundTasks
from fastapi.responses import FileResponse
from models import Vaga
from utils import generate_hash_sha256, generate_ulid, save_to_csv, load_from_csv, sum_lines_from_csv, to_zip
from typing import List, Optional
from datetime import datetime
import asyncio
from concurrent.futures import ThreadPoolExecutor

router = APIRouter()
executor = ThreadPoolExecutor()

VAGAS_FILE = "vagas.csv"
VAGAS_FIELDS = ["id", "tipo", "categoria", "empresa", "status", "data_criacao","descricao"]

@router.post("/", response_model=Vaga)
def create(vaga: Vaga):
    vagas = load_from_csv(VAGAS_FILE, Vaga)
    
    vaga.id = generate_ulid()
    vaga.data_criacao = datetime.now()
    
    vagas.append(vaga)
    save_to_csv(VAGAS_FILE, [h.model_dump() for h in vagas], VAGAS_FIELDS)
    return vaga

@router.get("/", response_model=List[Vaga])
def list(
    categoria: Optional[str] = Query(None, description="Filtrar por categoria"),
    status: Optional[str] = Query(None, description="Filtrar por status"),
    tipo: Optional[str] = Query(None, description="Filtrar por tipo")
):
    vagas = load_from_csv(VAGAS_FILE, Vaga)
    
    if categoria:
        vagas = [vaga for vaga in vagas if vaga.categoria == categoria]
    if status:
        vagas = [vaga for vaga in vagas if vaga.status == status]
    if tipo:
        vagas = [vaga for vaga in vagas if vaga.tipo == tipo]
        
    return vagas

@router.get("/total")
def get():
    total = sum_lines_from_csv(VAGAS_FILE)
    return {"total": total}

@router.get("/hash")
async def get():
    if not os.path.exists(VAGAS_FILE):
        raise HTTPException(status_code=404, detail="Arquivo CSV não encontrado.")
    
    try:
        # Compressão do arquivo em uma thread separada
        loop = asyncio.get_running_loop()
        hash_sha256 = await loop.run_in_executor(executor, generate_hash_sha256, VAGAS_FILE)
        
        return { "hash_sha256": hash_sha256 }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao processar o arquivo: {e}")
    

@router.get("/zip")
async def zip(background_tasks: BackgroundTasks):
    if not os.path.exists(VAGAS_FILE):
        raise HTTPException(status_code=404, detail="Arquivo CSV não encontrado.")
    
    path_zip_file = "vagas-" + generate_ulid() + ".zip"
    
    try:
        # Compressão do arquivo em uma thread separada
        loop = asyncio.get_running_loop()
        await loop.run_in_executor(executor, to_zip, VAGAS_FILE, path_zip_file)
        
        if not os.path.exists(path_zip_file):
            raise HTTPException(status_code=500, detail="Falha ao criar o arquivo ZIP.")
        
        # Gerar o hash do arquivo ZIP em uma thread separada
        hash_sha256 = await loop.run_in_executor(executor, generate_hash_sha256, path_zip_file)
        
        # Agendar a remoção do arquivo após o envio da response
        background_tasks.add_task(os.remove, path_zip_file)
        
        response = FileResponse(
            path_zip_file,
            media_type="application/zip",
            filename="vagas.zip",
            headers={"Zip-File-Hash": hash_sha256}
        )
        
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao processar o arquivo: {e}")

@router.get("/{id}", response_model=Vaga)
def get(id: str):
    vagas = load_from_csv(VAGAS_FILE, Vaga)
    for item in vagas:
        if item.id == id:
            return item
    raise HTTPException(status_code=404, detail="Vaga não encontrada")

@router.put("/{id}", response_model=Vaga)
def update(id: str, updated: Vaga):
    vagas = load_from_csv(VAGAS_FILE, Vaga)
    for idx, item in enumerate(vagas):
        if item.id == id:
            vagas[idx] = updated
            vagas[idx].id = item.id
            vagas[idx].data_criacao = item.data_criacao
            save_to_csv(VAGAS_FILE, [h.model_dump() for h in vagas], VAGAS_FIELDS)
            return vagas[idx]
    raise HTTPException(status_code=404, detail="Vaga não encontrada")

@router.delete("/{id}")
def delete(id: str):
    vagas = load_from_csv(VAGAS_FILE, Vaga)
    vagas = [item for item in vagas if item.id != id]
    save_to_csv(VAGAS_FILE, [h.model_dump() for h in vagas], VAGAS_FIELDS)
    return {"message": "Vaga deletada com sucesso"}

