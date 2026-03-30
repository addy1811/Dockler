import asyncio
from google import genai

def build_prompt(question: str, context_chunks: list[str]) -> str:
    context = "\n\n---\n\n".join(context_chunks)
    return f"""You are a helpful assistant that answers questions strictly based on the document content provided below.
If the answer is not found in the document, say: "I could not find an answer to that in the uploaded document."
Do not use any outside knowledge. Do not make up information.

DOCUMENT CONTEXT:
{context}

USER QUESTION:
{question}

ANSWER:"""


async def get_llm_ans(question: str, context_chunks: list[str], api_key: str) -> str:
    if not context_chunks:
        return "No relevant content found in the document to answer your question."

    prompt = build_prompt(question, context_chunks)

    for attempt in range(3):
        try:
            client = genai.Client(api_key=api_key)
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                lambda: client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt
                )
            )
            return response.text

        except Exception as e:
            if "429" in str(e) and attempt < 2:
                wait = (attempt + 1) * 30
                print(f"Rate limited. Waiting {wait}s...")
                await asyncio.sleep(wait)
            else:
                raise