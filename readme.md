## OpenParts - Electronic Components Manager
OpenParts is an open-source web application designed for hobbyists and electronics enthusiasts to manage their electronic components efficiently. This tool allows users to keep track of various components such as resistors, capacitors, and integrated circuits in a user-friendly interface.

#### Features
* Component Management: Easily add, view, and manage your electronic components.
* Search Functionality: Quickly find components using a search bar that filters results based on partial names.
* KiCAD Integration: Link your KiCAD library files (footprints, symbols, and 3D models) for easy access.
* 3D Model Viewer: Placeholder for displaying 3D models of components.

#### Installation
To set up the OpenParts application on your local machine, follow these steps:
* Clone the Repository:
```git clone https://github.com/servomouse/open_parts.git```
```cd open_parts```
* Set Up a Virtual Environment (optional but recommended):
```python -m venv venv```
```source venv/bin/activate```  # On Windows run ```venv\Scripts\activate``` (CMD) or ```venv\Scripts\Activate.ps1``` (PowerShell)

* Install Required Packages:
    ```pip install -r requirements.txt```

* Run the Application:
    * run ```python app.py``` in your console to start the Flask server
    * Open your favourite web browser and navigate to http://127.0.0.1:5000 to access the application.

#### Usage
**Viewing Components:**
Once the application is running, you will see a list of available components. You can search for specific components using the search bar.

**Adding Components:**
* Click the "Add" button next to the component type you want to add.
* Fill in the required fields in the modal form.
* Click the "Add" button at the bottom of the modal to submit the new component.

**Viewing Component Details:**
Click on any component in the list to view its details, including its image, description, KiCAD links, and more.

#### Contributing
Contributions are welcome! If you have suggestions for improvements or new features, feel free to open an issue or submit a pull request.
