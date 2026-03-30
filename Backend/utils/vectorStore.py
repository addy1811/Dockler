import chromadb
from sentence_transformers import SentenceTransformer

embedding_model = SentenceTransformer("all-MiniLM-L6-v2") 

def get_chroma_client(persist_dir : str) -> chromadb.Client:
     return  chromadb.PersistentClient(path = persist_dir)
    
def create_collection(client: chromadb.PersistentClient, collection: str):
    """Each uploaded document gets its own ChromaDB collection."""
    return client.get_or_create_collection(
        name=collection,
        metadata={"hnsw:space": "cosine"}
    )
 
def embed_store(chunks : list[dict] , collection , doc_id : str):
    texts = [chunk["text"] for chunk in chunks]
    embeddings = embedding_model.encode(texts).tolist()
    
    ids = [f"{doc_id} chunk {chunk['chunk_idx']}" for chunk in chunks] 
    metadatas = [{"doc_id" : doc_id , "chunk_idx" : chunk["chunk_idx"]} for chunk in chunks]
    collection.add(
        documents = texts,
        embeddings = embeddings,
        ids = ids,
        metadatas = metadatas
    )
    

def retrieve_chunks(query : str , collection , top_k : int = 5) -> list[str]:
 
     query_embed = embedding_model.encode([query]).tolist()
     res = collection.query(
         query_embeddings = query_embed,
         n_results = top_k
     )
     return res["documents"][0] if res["documents"] else []
 
def del_collection(client: chromadb.Client, collection_name: str):
    try:
        client.delete_collection(name=collection_name)
    except Exception:
        pass
 