from flask import Flask, jsonify, request, send_file, render_template
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///components.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Define the Component model
class Component(db.Model):
    id          = db.Column(db.Integer, primary_key=True)
    category    = db.Column(db.String(100), nullable=False)
    name        = db.Column(db.String(100), nullable=False)
    case        = db.Column(db.String(50))
    value       = db.Column(db.String(50))
    precision   = db.Column(db.String(10))
    voltage     = db.Column(db.String(50))
    technology  = db.Column(db.String(50))
    description = db.Column(db.Text)
    image       = db.Column(db.String(200))
    kicad_links = db.Column(db.Text)  # Store as comma-separated values
    model       = db.Column(db.String(200))
    amount      = db.Column(db.Integer)

    def to_dict(self):
        return {
            'id': self.id,
            'category': self.category,
            'name': self.name,
            'case': self.case,
            'value': self.value,
            'precision': self.precision,
            'voltage': self.voltage,
            'technology': self.technology,
            'description': self.description,
            'image': self.image,
            'kicad_links': self.kicad_links.split(',') if self.kicad_links else [],
            'model': self.model,
            'amount': self.amount
        }

# Create the database
@app.before_request
def create_tables():
    db.create_all()

# API endpoint to get all components
@app.route('/api/components', methods=['GET'])
def get_components():
    components = Component.query.all()
    data = {}
    for component in components:
        c = component.to_dict()
        category = c['category']
        data.setdefault(category, []).append(c)
    # print(f"Prepared data: {data}")
    # data = jsonify([component.to_dict() for component in components])
    data = jsonify(data)
    # print(f"Jsonified components data: {data}")
    return data

# API endpoint to add a new component
@app.route('/api/components', methods=['POST'])
def add_component():
    data = request.json
    print(f"Received new component data: {data}")
    new_component = Component(
        category=data['category'],
        name=data['name'],
        case=data.get('case'),
        value=data.get('value'),
        precision=data.get('precision'),
        voltage=data.get('voltage'),
        technology=data.get('technology'),
        description=data.get('description'),
        image=data.get('image'),
        kicad_links=','.join(data.get('kicad_links', [])),
        model=data.get('model'),
        amount=data.get('amount', 0)
    )
    db.session.add(new_component)
    db.session.commit()
    # return jsonify(new_component.to_dict()), 201
    return "Component added"

# Example components_data dictionary
components_data = {
    "Resistor": {
        "0603": "images/resistor_1w.jpg",
    },
}

@app.route('/api/component_image', methods=['GET'])
def get_component_image():
    category = request.args.get('category')
    case = request.args.get('case')

    # Validate the inputs
    if not category or not case:
        return jsonify({"error": "Category and case are required."}), 400

    # # Check if the category exists
    # if category not in components_data:
    #     return jsonify({"error": "Category not found."}), 404

    # # Check if the case exists for the given category
    # if case not in components_data[category]:
    #     return jsonify({"error": "Case not found."}), 404

    # # Get the image path
    # image_path = components_data[category][case]

    image_path = "images/resistor_1w.jpg"

    # Check if the image path is a URL or a local file
    if image_path.startswith('http://') or image_path.startswith('https://'):
        return image_path  # Return the URL directly
    else:
        # Serve the local file
        if os.path.exists(image_path):
            return send_file(image_path)
        else:
            return jsonify({"error": "Image file not found."}), 404

# Route to serve the main page
@app.route('/')
def index():
    return render_template('index.html')

# Function to populate the database with initial component data
def populate_database():
    with app.app_context():  # Set up application context
        # Hardcoded component data
        components_data = {
            'resistors': [
                {
                    'name': "10k Ohm Resistor",
                    'case': "0603",
                    'value': "10k",
                    'precision': "1%",
                    'technology': "film",
                    'description': "Standard 10k Ohm resistor.",
                    'image': "path/to/resistor-image.jpg",
                    'kicad_links': ["link/to/footprint", "link/to/symbol"],
                    'model': "path/to/3d-model.step",
                    'amount': 10
                },
                {
                    'name': "100k Ohm Resistor",
                    'case': "0603",
                    'value': "100k",
                    'precision': "1%",
                    'technology': "film",
                    'description': "Standard 100k Ohm resistor.",
                    'image': "path/to/resistor-image.jpg",
                    'kicad_links': ["link/to/footprint", "link/to/symbol"],
                    'model': "path/to/3d-model.step",
                    'amount': 10
                }
            ],
            'capacitors': [
                {
                    'name': "10uF Capacitor",
                    'case': "0805",
                    'value': "10uF",
                    'voltage': "50V",
                    'technology': "electrolytic",
                    'description': "Electrolytic capacitor, 10uF.",
                    'image': "path/to/capacitor-image.jpg",
                    'kicad_links': ["link/to/footprint", "link/to/symbol"],
                    'model': "path/to/3d-model.step",
                    'amount': 10
                }
            ],
            'ics': [
                {
                    'name': "NE555 Timer",
                    'case': "DIP-8",
                    'technology': "CMOS",
                    'description': "Simple timer",
                    'image': "path/to/ic-image.jpg",
                    'kicad_links': ["link/to/footprint", "link/to/symbol"],
                    'model': "path/to/3d-model.step",
                    'amount': 10
                }
            ]
        }

        # Iterate through the categories and add components to the database
        for category, components in components_data.items():
            for component in components:
                new_component = Component(
                    category=category,
                    name=component['name'],
                    case=component.get('case'),
                    value=component.get('value'),
                    precision=component.get('precision'),
                    voltage=component.get('voltage'),
                    technology=component.get('technology'),
                    description=component.get('description'),
                    image=component.get('image'),
                    kicad_links=','.join(component.get('kicad_links', [])),
                    model=component.get('model'),
                    amount=component.get('amount', 0)
                )
                db.session.add(new_component)
        
        db.session.commit()

if __name__ == '__main__':
    # with app.app_context():
    #     db.create_all()
    # populate_database()
    app.run(debug=True)
