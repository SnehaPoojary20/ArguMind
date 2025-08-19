import os
import re
import openai
from fastapi import FastAPI
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup Together AI client
client = openai.OpenAI(
    api_key=os.environ.get("TOGETHER_API_KEY"),
    base_url="https://api.together.xyz/v1",
)

# Pydantic model
class DebateRequest(BaseModel):
    user_input: str
    topic: str = "Debate"
    stance: str = "neutral"
    tone: str = "formal"


@app.post("/debate")
def stream_debate_response(request: DebateRequest):
    system_prompt = (
        f"You are a debate assistant. Debate on the topic '{request.topic}'. "
        f"Take a {request.stance} stance. Use a {request.tone} tone. "
        "Respond with only 1–2 concise and well-structured points per reply. "
        "Each point should be 2–3 sentences at most. Avoid giving the full debate in one turn. "
        "Ensure all output has correct spaces between words, proper punctuation, "
        "and is easy to read when streamed."
    )

    def stream_generator():
        stream = client.chat.completions.create(
            model="Qwen/Qwen2.5-7B-Instruct-Turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.user_input}
            ],
            stream=True,
        )

        prev_char = ""
        for chunk in stream:
            content = chunk.choices[0].delta.content
            if content:
                # Fix space between chunks if both sides are letters/numbers
                if prev_char and prev_char.isalnum() and content[0].isalnum():
                    content = " " + content

                # Fix common missing spaces inside chunks
                content = re.sub(r'([a-z])([A-Z])', r'\1 \2', content)
                content = re.sub(r'(\.)([A-Z])', r'\1 \2', content)
                content = re.sub(r'(,)([A-Z])', r'\1 \2', content)

                prev_char = content[-1]
                yield f"data: {content}\n\n"

    return StreamingResponse(stream_generator(), media_type="text/event-stream")


@app.post("/score")
async def score_response(data: dict):
    ai_reply = data.get("ai_reply")
    if not ai_reply:
        return JSONResponse(status_code=400, content={"error": "Missing ai_reply"})

    scoring_prompt = (
        f"Rate the following debate reply on a scale of 1 to 5 "
        f"for clarity, relevance, and persuasiveness. Just return the number.\n"
        f"Response: {ai_reply}"
    )

    res = client.chat.completions.create(
        model="Qwen/Qwen2.5-7B-Instruct-Turbo",
        messages=[
            {"role": "user", "content": scoring_prompt}
        ]
    )

    score = res.choices[0].message.content.strip()
    return {"score": score}


# tgp_v1_G1zAw6Tz5vtJkEOakTb0fH9BYA0wvspJFDgdZDeGXPU
#python -m uvicorn main:app --reload