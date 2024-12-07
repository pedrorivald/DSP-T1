from typing import Literal, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class Vaga(BaseModel):
    id: Optional[str] = Field(None, description="ID gerado automaticamente pelo sistema")
    descricao: str = Field(
        ..., 
        min_length=1, 
        max_length=1000, 
        description="Descrição detalhada da vaga (entre 10 e 1024 caracteres)"
    )
    status: Literal["ativa", "inativa"] = Field(..., description="Status da vaga")
    categoria: Literal["frontend", "backend", "mobile", "fullstack", "devops", "qa"] = Field(..., description="Categoria da vaga")
    tipo: Literal["remota", "hibrida", "presencial"] = Field(..., description="Tipo de vaga")
    empresa: str = Field(
        ..., 
        min_length=1, 
        max_length=255, 
        description="Empresa dona da vaga"
    )
    data_criacao: Optional[datetime] = Field(None, description="Data que a vaga foi criada")