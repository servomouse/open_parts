from flask import Flask, jsonify, request, send_file, render_template
# from flask_sqlalchemy import SQLAlchemy
import os
from sqlite_db import SQLiteIface

app = Flask(__name__)
db = SQLiteIface('database/components.db')

# Create the database
@app.before_request
def create_tables():
    db.create_table('components')

# API endpoint to get all components
@app.route('/api/components', methods=['GET'])
def get_components():
    components = db.export_table_to_dict('components')
    data = {}
    for comp in components:
        if comp['category'] not in data:
            data[comp['category']] = []
        data[comp['category']].append(comp)
    print(f"Components requested: {data}")
    data = jsonify(data)
    return data

# API endpoint to add a new component
@app.route('/api/add_component', methods=['POST'])
def add_component():
    data = request.json
    print(f"Received new component data: {data}")
    db.add_component(data)
    return "Component added"

# API endpoint to add a new component
@app.route('/api/update_component', methods=['POST'])
def update_component():
    data = request.json
    print(f"Received new component data: {data}")
    db.edit_component(data)
    return "Component added"


# Route to serve the main page
@app.route('/')
def index():
    return render_template('index_test.html')


if __name__ == '__main__':
    app.run(debug=True)
