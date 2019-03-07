from flask import Flask
from flask import request, jsonify
import urllib
import json
from functools import wraps

import logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)

def prepare_success_response(input_data):
    return app.response_class(response=json.dumps(input_data), status=200, mimetype='application/json')

# def prepare_success_response_callback(callback, input_data):
#     return app.response_class(response=str(callback)+'('+json.dumps(input_data)+')', status=200, mimetype='application/json')


# render home page
@app.route('/')
def root():
    return app.send_static_file('index.html')


# for GET example
@app.route('/v1/api/getexample', methods=["GET"])
def get_example():
    #callback = request.args.get('callback','False')
    self = dict()
    self["param1"] = request.args.get('param1', 'param_1')
    self["param2"] = request.args.get('param2', 'param_2')
    self["page_number"] = int(request.args.get('page_number', '1'))
    self["search_criteria"] = request.args.get('search_criteria', '{}')

    result = self
#    return prepare_success_response(callback, result)
    return prepare_success_response(result)

# POST example
@app.route('/v1/api/postexample', methods=["POST"])
def post_example():
    self = dict()
    self["post_data"] = request.get_json()

    result = self
    return prepare_success_response( result)


if __name__ == "__main__":
    print({"message": "Starting Flask UI API Server"})
    app.run(host='0.0.0.0', port=8086, threaded=True)


