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

# API
### Executar localmente
`pip install --no-cache-dir -r requirements.txt`
uvicorn main:app --reload --port 5000

# Frontend
### Executar localmente
(node 22 e angular 19)
`cd frontend`
`npm install`
`npm run start:dev`
`npm run start:prod`
`npm run build:dev`
`npm run build:prod`

### Docker API
`cd api`
`docker build -t dsp-t1 .`
`docker run -d -p 8000:8000 dsp-t1`

### Docker Frontend
`cd frontend`
`docker build -t dsp-t1-frontend .`
`docker run -d -p 8001:8001 dsp-t1-frontend`