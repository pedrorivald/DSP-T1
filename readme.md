# Vaga
id           | string
descricao    | string
status       | string (ativa ou inativa)
categoria    | string (frontend, backend, mobile, fullstack, devops ou qa)
tipo         | string (remota, hibrida ou presencial)
empresa      | string
data_criacao | datetime

# Dependencias
pip install fastapi
pip install uvicorn
pip install python-ulid

# Executar
uvicorn main:app --reload --port 5000