import sqlite3

tables_structs = {
    "components": {
        "id":               "INTEGER PRIMARY KEY AUTOINCREMENT",
        "category":         "TEXT NOT NULL",
        "subcategory":      "TEXT NOT NULL",
        "group_name":       "TEXT NOT NULL",
        "name":             "TEXT",
        "package":          "TEXT",
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
    },
    "updates": {}
}


class SQLiteIface:
    def __init__(self, filename):
        self.db = filename
    
    def execute_command(self, cmd, args: tuple):
        try:
            with sqlite3.connect(self.db) as conn:
                cursor = conn.cursor()
                if args is None:
                    cursor.execute(cmd)
                else:
                    cursor.execute(cmd, args)
                conn.commit()
        except sqlite3.Error as e:
            print(f"An error occurred: {e}")

    def table_exists(self, table_name):
        try:
            with sqlite3.connect(self.db) as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name=?", (table_name,))
                result = cursor.fetchone()
            return result is not None
        except sqlite3.Error as e:
            print(f"An error occurred: {e}")
    
    def create_table(self, table_name):
        '''
            Creates table table_name if not exists, otherwise does nothing
        '''
        if table_name not in tables_structs:
            print(f"Error: couldn't find table structure for {table_name}!")
            return
        command = f'CREATE TABLE IF NOT EXISTS {table_name} ('
        for key, value in tables_structs[table_name].items():
            command += f" {key} {value},"
        command = command[:-1] + ')'
        self.execute_command(command, None)

    def add_component(self, data):
        keys = list(tables_structs['components'].keys())
        keys.remove('id')
        values = []
        for key in keys:
            values.append(data[key])
        command = 'INSERT INTO components (' + ', '.join(keys) + ') VALUES (' + ', '.join(['?' for _ in range(len(keys))]) + ')'
        self.execute_command(command, tuple(values))

    def remove_component(self, component_id):
        self.execute_command('DELETE FROM components WHERE id = ?', (component_id,))

    def edit_component(self, data):
        keys = list(tables_structs['components'].keys())
        keys.remove('id')
        values = []
        for key in keys:
            values.append(data[key])
        values.append(data['id'])
        self.execute_command(f"UPDATE components SET {' = ?, '.join(keys)} = ? WHERE id = ?", tuple(values))

    def export_table_to_dict(self, table_name):
        try:
            with sqlite3.connect(self.db) as conn:
                cursor = conn.cursor()
                cursor.execute(f'SELECT * FROM {table_name}')
                rows = cursor.fetchall()
                column_names = [description[0] for description in cursor.description]
                result = []
                for row in rows:
                    row_dict = {column_names[i]: row[i] for i in range(len(column_names))}
                    result.append(row_dict)
            return result
        except sqlite3.Error as e:
            print(f"An error occurred: {e}")


    def get_last_n_entries(self, table_name, n=10):
        try:
            with sqlite3.connect(self.db) as conn:
                cursor = conn.cursor()
                cursor.execute(f'SELECT * FROM {table_name} ORDER BY id DESC LIMIT ?', (n,))
                rows = cursor.fetchall()
                column_names = [description[0] for description in cursor.description]

                result = []
                for row in rows:
                    row_dict = {column_names[i]: row[i] for i in range(len(column_names))}
                    result.append(row_dict)
            return result
        except sqlite3.Error as e:
            print(f"An error occurred: {e}")


test_comp_list = [
    # {
    #     "category":         "ICs",
    #     "subcategory":      "times",
    #     "group_name":       "",
    #     "name":             "NE555",
    #     "package":          "DIP-8",
    #     "value":            "",
    #     "precision":        "",
    #     "voltage":          "",
    #     "technology":       "CMOS",
    #     "description":      "555 Timer IC",
    #     "image":            "",
    #     "kicad_footprint":  "",
    #     "kicad_symbol":     "",
    #     "model_3d":         "",
    #     "amount":           12,
    # },
    {
        "category":         "Resistors",
        "subcategory":      "",
        "group_name":       "",
        "name":             "",
        "package":          "0805",
        "value":            "10k",
        "precision":        "1%",
        "voltage":          "",
        "technology":       "",
        "description":      "100k SMD resistor",
        "image":            "",
        "kicad_footprint":  "",
        "kicad_symbol":     "",
        "model_3d":         "",
        "amount":           10,
    },
    {
        "category":         "Capacitors",
        "subcategory":      "",
        "group_name":       "",
        "name":             "",
        "package":          "0603",
        "value":            "10n",
        "precision":        "",
        "voltage":          "15V",
        "technology":       "Ceramic",
        "description":      "100n ceramic SMD capacitor",
        "image":            "",
        "kicad_footprint":  "",
        "kicad_symbol":     "",
        "model_3d":         "",
        "amount":           24,
    }
]


# if __name__ == "__main__":
#     db = SQLiteIface('database/components.db')
#     db.create_table('components')
#     print(f"{db.export_table_to_dict('components') = }")
#     for comp in test_comp_list:
#         db.add_component(comp)
#     print(f"{db.export_table_to_dict('components') = }")