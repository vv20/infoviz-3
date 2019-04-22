import pandas as pd

DATASET_FILENAME = "economic_freedom_index2019_data.csv"
OUTPUT_FILENAME = "cleaned_dataset.csv"

def strip_and_float(s):
    if isinstance(s, float):
        return s
    s = s.replace(",", "")
    s = s.replace("$", "")
    return float(s.split(" ")[0])

columns_to_clean = [
        "Tariff Rate (%)",
        "Income Tax Rate (%)",
        "Corporate Tax Rate (%)",
        "Tax Burden % of GDP",
        "Gov't Expenditure % of GDP ",
        "GDP (Billions, PPP)",
        "GDP Growth Rate (%)",
        "5 Year GDP Growth Rate (%)",
        "GDP per Capita (PPP)",
        "Unemployment (%)",
        "Inflation (%)",
        "FDI Inflow (Millions)",
        "Public Debt (% of GDP)",
        "Population (Millions)"
        ]

df = pd.read_csv(DATASET_FILENAME, encoding="ISO-8859-1")
for column in columns_to_clean:
    df[column] = df[column].apply(strip_and_float)
df.to_csv(OUTPUT_FILENAME, index=False)
