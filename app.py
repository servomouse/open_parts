from flask import Flask, jsonify, request, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///components.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Define the Component model
class Component(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    case = db.Column(db.String(50))
    value = db.Column(db.String(50))
    precision = db.Column(db.String(10))
    voltage = db.Column(db.String(50))
    description = db.Column(db.Text)
    image = db.Column(db.String(200))
    kicad_links = db.Column(db.Text)  # Store as comma-separated values
    model = db.Column(db.String(200))
    amount = db.Column(db.Integer)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'case': self.case,
            'value': self.value,
            'precision': self.precision,
            'voltage': self.voltage,
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
    return jsonify([component.to_dict() for component in components])

# API endpoint to add a new component
@app.route('/api/components', methods=['POST'])
def add_component():
    data = request.json
    new_component = Component(
        name=data['name'],
        case=data.get('case'),
        value=data.get('value'),
        precision=data.get('precision'),
        voltage=data.get('voltage'),
        description=data.get('description'),
        image=data.get('image'),
        kicad_links=','.join(data.get('kicad_links', [])),
        model=data.get('model'),
        amount=data.get('amount', 0)
    )
    db.session.add(new_component)
    db.session.commit()
    return jsonify(new_component.to_dict()), 201

# Route to serve the main page
@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
