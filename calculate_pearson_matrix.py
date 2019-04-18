import pandas as pd
import numpy as np

DATASET_FILENAME = "cleaned_dataset.csv"
OUTPUT_FILENAME = "pearson_matrix.csv"
x_names = [
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
    "Public Debt (% of GDP)"
]
y_names = [
    "Property Rights",
    "Judical Effectiveness",
    "Government Integrity",
    "Tax Burden",
    "Gov't Spending",
    "Fiscal Health",
    "Business Freedom",
    "Labor Freedom",
    "Monetary Freedom",
    "Trade Freedom",
    "Investment Freedom ",
    "Financial Freedom"
]

def calculateCorrelation(x_column, y_column):
    x_deviations = x_column - np.mean(x_column)
    y_deviations = y_column - np.mean(y_column)
    xy_deviations = x_deviations * y_deviations
    numerator = xy_deviations.sum()
    denominator = np.std(x_column) * np.std(y_column) * (x_column.size - 1)
    return numerator / denominator

df = pd.read_csv(DATASET_FILENAME, encoding="ISO-8859-1")
matrix = []
for x_name in x_names:
    for y_name in y_names:
        matrix.append([x_name, y_name, calculateCorrelation(df[x_name],df[y_name])])

result = pd.DataFrame(data=matrix, columns=["x_name", "y_name", "correlation"])
result.to_csv(OUTPUT_FILENAME, index=False)
