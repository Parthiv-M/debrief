from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from debrief import SiteToDebrief
from utils import setup_env
from urllib.parse import unquote 

app = FastAPI()

setup_env()

# CORS configuration
origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def index():
    return {"message": "API is functional"}

@app.get("/site/{link}")
async def get_site_data(link: str):
    url: str = unquote(unquote(link))
    site_to_debrief: SiteToDebrief = SiteToDebrief(url=url)
    site_data: dict = site_to_debrief.get_site_data()
    return site_data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
