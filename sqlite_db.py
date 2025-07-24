import sqlite3


component_table_struct = {
    "id":               "INTEGER PRIMARY KEY AUTOINCREMENT",
    "category":         "TEXT NOT NULL",
    "name":             "TEXT",
    "case":             "TEXT",
    "value":            "TEXT",
    "precision":        "TEXT",
    "voltage":          "TEXT",
    "technology":       "TEXT",
    "description":      "TEXT",
    "image":            "TEXT",
    "kicad_footprint":  "TEXT",
    "kicad_symbol":     "TEXT",
    "model_3d":         "TEXT",
    "amount":           "INTEGER",
}

updates_table_struct = {}


class SQLiteIface:
    def __init__(self, filename):
        self.db = filename
    
    def execute_command(self, cmd, args: tuple):
        try:
            connection = sqlite3.connect('components.db')
            cursor = connection.cursor()
            cursor.execute(cmd, args)
            connection.commit()
            connection.close()
        except sqlite3.Error as e:
            print(f"An error occurred: {e}")
        finally:
            connection.close()

    def table_exists(self, table_name):
        connection = sqlite3.connect('components.db')
        cursor = connection.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name=?", (table_name,))
        result = cursor.fetchone()
        connection.close()
        return result is not None

    def add_component(self, data):
        self.execute_command(
            'INSERT INTO components (name, type, value, description) VALUES (?, ?, ?, ?)',
            (name, type, value, description)
        )

    def remove_component(self, component_id):
        self.execute_command('DELETE FROM components WHERE id = ?', (component_id,))

    def edit_component(self, component_id, name, type, value, description):
        self.execute_command('''
            UPDATE components
            SET name = ?, type = ?, value = ?, description = ?
            WHERE id = ?
            ''',
            (name, type, value, description, component_id)
        )


    def export_table_to_dict(self, table_name):
        connection = sqlite3.connect('components.db')
        cursor = connection.cursor()
        cursor.execute(f'SELECT * FROM {table_name}')
        rows = cursor.fetchall()
        column_names = [description[0] for description in cursor.description]
        result = []
        for row in rows:
            row_dict = {column_names[i]: row[i] for i in range(len(column_names))}
            result.append(row_dict)
        connection.close()
        return result


    def get_last_n_entries(self, table_name, n=10):
        connection = sqlite3.connect('components.db')
        cursor = connection.cursor()

        cursor.execute(f'SELECT * FROM {table_name} ORDER BY id DESC LIMIT ?', (n,))

        rows = cursor.fetchall()
        column_names = [description[0] for description in cursor.description]

        result = []
        for row in rows:
            row_dict = {column_names[i]: row[i] for i in range(len(column_names))}
            result.append(row_dict)
        connection.close()
        return result


if __name__ == "__main__":
    connection = sqlite3.connect('components.db')
    cursor = connection.cursor()

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS components (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        value TEXT NOT NULL,
        description TEXT
    )
    ''')
    connection.commit()
    connection.close()