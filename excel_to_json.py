import pandas as pd
import json

file = "Estrazione_aziende 21-05-2026 o.xlsx"

df = pd.read_excel(file)
df = df.dropna(how="all")

data = df.to_dict(orient="records")

with open("db.json", "w") as f:
    json.dump(data, f, indent=2)

print("JSON created successfully")