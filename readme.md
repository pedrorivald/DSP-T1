# Atributos da Vaga
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

# Acessar na nuvem
frontend: https://dsp-t1.vercel.app/
api: https://dsp-t1-latest.onrender.com/docs

# API
### Executar localmente
`cd api`
`pip install --no-cache-dir -r requirements.txt`
`uvicorn main:app --reload --port 8000`

### Docker API
`cd api`
`docker build -t dsp-t1 .`
`docker run -d -p 8000:8000 dsp-t1`

# Frontend
### Executar localmente
(node 22 e angular 19)
`cd frontend`
`npm install`
`npm run start:dev`

### Docker Frontend
`cd frontend`
`docker build -t dsp-t1-frontend .`
`docker run -d -p 8001:8001 dsp-t1-frontend`