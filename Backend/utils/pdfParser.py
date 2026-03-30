import fitz

def ext_pdf_txt(file_path : str) ->str:
     doc = fitz.open(file_path)
     full_txt = ""
     
     for pg_num in range(len(doc)):
         page  = doc[pg_num]
         full_txt += page.get_text()
         
        
     doc.close()
          
     return full_txt.strip()

def chunk_txt(text : str , piece_size = 500 , piece_overlap = 50) -> list[dict]:
     chunks = []
     start = 0 
     idx = 0
     
     while start < len(text) :
         end = start + piece_size
         chunk_txt = text[start:end]
         
         if chunk_txt.strip() :
             chunks.append({
                 "text" : chunk_txt,
                 "chunk_idx" : idx
             })
             idx += 1
             
            
         start += piece_size - piece_overlap
         
     return chunks  
         
     