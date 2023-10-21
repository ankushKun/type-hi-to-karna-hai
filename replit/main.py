from flask import Flask, request
import numpy as np
import json
import requests
import os
from flask_cors import CORS
import tflite_runtime.interpreter as tflite
from sklearn.feature_extraction.text import CountVectorizer

app = Flask(__name__)
CORS(app)

global tokenizer
with open("encoder_vocab.json") as v:
    vocab = json.load(v)
tokenizer = CountVectorizer(vocabulary=vocab)
global decode_arr
model = tflite.Interpreter(model_path="model.tflite")
model.allocate_tensors()
with open("lable_vocab.json") as v:
    decode_arr = json.load(v)

print("ready")


@app.route("/")
def index():
    return "Hello from Flask!"


def preprocess(desc):
    global tokenizer
    return tokenizer.transform([desc])


def decode(a):
    global decode_arr
    return decode_arr[a]


@app.route("/api/get_tag", methods=["POST"])
def tagger():
    global model
    data = request.json
    description = data["description"]
    global tokenizer
    description = tokenizer.transform([description])
    input_details = model.get_input_details()
    output_details = model.get_output_details()
    model.set_tensor(0, [description.toarray().astype('float32')])
    model.invoke()
    arr = ["bug", "enhancement", "question"]
    output_data = model.get_tensor(output_details[0]['index'])
    return {"lable": arr[int(np.argmax(output_data))]}, 200


if __name__ == "__main__":
    app.run(port=6060, debug=True, host='0.0.0.0')
