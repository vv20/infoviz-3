import pandas as pd

DATASET_FILENAME = "economic_freedom_index2019_data.csv"
OUTPUT_FILENAME = "cleaned_dataset.csv"

def decode_dolla(s):
    if isinstance(s, float):
        return s
    s = s.replace(",", "")
    s = s.split(" ")[0]
    return float(s[1:])

def strip_and_float(s):
    if isinstance(s, float):
        return s
    s = s.replace(",", "")
    return float(s.split(" ")[0])

df = pd.read_csv(DATASET_FILENAME, encoding="ISO-8859-1")
df["GDP (Billions, PPP)"] = df["GDP (Billions, PPP)"].apply(decode_dolla)
df["GDP per Capita (PPP)"] = df["GDP per Capita (PPP)"].apply(decode_dolla)
df["Unemployment (%)"] = df["Unemployment (%)"].apply(strip_and_float)
df["FDI Inflow (Millions)"] = df["FDI Inflow (Millions)"].apply(strip_and_float)
df.to_csv(OUTPUT_FILENAME, index=False)
