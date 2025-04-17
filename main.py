from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from ultralytics import YOLO
from PIL import Image
import io

app = FastAPI()
model = YOLO("best.pt")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes))

    # Run YOLOv11 inference
    results = model(image)

    # Extract class names
    detected = []
    for box in results[0].boxes:
        cls_id = int(box.cls)
        label = results[0].names[cls_id]
        detected.append(label)

    return JSONResponse(content={"ingredients": list(set(detected))})