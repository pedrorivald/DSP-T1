import csv
from ulid import ULID
from typing import List, Type, TypeVar
import zipfile
import hashlib

T = TypeVar('T')

def generate_ulid() -> str:
    """Gera um ULID único."""
    return str(ULID())

def save_to_csv(file_path: str, data: List[dict], fieldnames: List[str]):
    """Salva dados em formato CSV."""
    try:
        with open(file_path, mode="w", newline="", encoding="utf-8") as file:
            writer = csv.DictWriter(file, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(data)
    except FileNotFoundError:
        return []

def load_from_csv(file_path: str, model: Type[T]) -> List[T]:
    """Carrega dados de um arquivo CSV e converte em objeto."""
    try:
        with open(file_path, mode="r", newline="", encoding="utf-8") as file:
            reader = csv.DictReader(file)
            return [model(**row) for row in reader]
    except FileNotFoundError:
        return []
    
def sum_lines_from_csv(file_path: str):
    """Soma todas as linhas de um CSV e retorna a quantidade total."""
    try:
        with open(file_path, mode="r", encoding="utf-8") as file:
            reader_csv = csv.reader(file)
            next(reader_csv) 
            total = sum(1 for _ in reader_csv)
            return total
    except FileNotFoundError:
        return 0
    
    
def to_zip(file_path: str, path_zip_file: str):
    """Comprime um arquivo para ZIP."""
    try: 
        with zipfile.ZipFile(path_zip_file, 'w') as zipf:
            zipf.write(file_path)
    except FileNotFoundError:
        return 0
    
def generate_hash_sha256(file_path: str):
    with open(file_path, 'rb') as f:
        file_data = f.read()
        sha256_hash = hashlib.sha256(file_data).hexdigest()
        return sha256_hash
