from flask import Flask, request,send_file
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
global pipe
from diffusers import StableDiffusionPipeline
import torch
model_id = "runwayml/stable-diffusion-v1-5"
pipe = StableDiffusionPipeline.from_pretrained(model_id,torch_dtype=torch.float16)
pipe = pipe.to("cuda")

@app.route("/")
def index():
    return "Hello from Flask!"


@app.route("/api/getimg", methods=["POST"])
def genrate_image():
    data = request.json
    prompt = data["prompt"]
    global pipe
    image = pipe(prompt).images[0]
    return send_file(image,mimetype='image'), 200

if __name__ == "__main__":
    app.run(port=6060, debug=True, host='0.0.0.0')
