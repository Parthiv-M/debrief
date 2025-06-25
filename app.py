from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
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

templates = Jinja2Templates(directory="templates")

@app.get("/")
async def index():
    return {"message": "API is functional"}

@app.get("/site/{link}")
async def get_site_data(link: str):
    url: str = unquote(unquote(link))
    site_to_debrief: SiteToDebrief = SiteToDebrief(url=url)
    site_data: dict = site_to_debrief.get_site_data()
    return site_data

@app.get("/privacy", response_class=HTMLResponse)
async def privacy(request: Request):
    return templates.TemplateResponse("privacy/index.html", { "request": request })

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
