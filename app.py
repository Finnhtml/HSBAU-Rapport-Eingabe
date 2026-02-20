import streamlit as st
import openpyxl
import json
import os
from datetime import datetime
from io import BytesIO

# Konfiguration laden
def load_config():
    with open('config.json', 'r', encoding='utf-8') as f:
        return json.load(f)

config = load_config()

st.set_page_config(page_title="HSBAU Rapport-Manager", layout="wide")

# Logo (falls vorhanden)
if os.path.exists("huberstraub Logo 1.png"):
    st.image("huberstraub Logo 1.png", width=200)

st.title("🏗️ HSBAU Rapport-Manager Pro")

# --- Tabs für die Bereiche (wie deine Seiten im Python-Tool) ---
tab1, tab2, tab3, tab4 = st.tabs(["Stammdaten", "Arbeit & Zeit", "Zusatzleistungen", "Bohren & Fräsen"])

data_input = {}

with tab1:
    st.header("Projektdaten")
    cols = st.columns(2)
    for i, f in enumerate([f for f in config['static_fields'] if f['section'] == "Stammda."]):
        target_col = cols[i % 2]
        data_input[f['cell']] = target_col.text_input(f['label'], key=f['cell'])

with tab2:
    st.header("Arbeiten & Zeiten")
    for f in [f for f in config['static_fields'] if f['section'] in ["Arbeit", "Zeit"]]:
        if f.get('multiline'):
            data_input[f['cell']] = st.text_area(f['label'], key=f['cell'])
        else:
            data_input[f['cell']] = st.text_input(f['label'], key=f['cell'])

with tab3:
    st.header("Zusatzleistungen")
    for sec in ["Instal.", "Schutz", "Entsorg.", "Geraete", "Eisen"]:
        with st.expander(f"Bereich: {sec}"):
            for f in [f for f in config['static_fields'] if f['section'] == sec]:
                data_input[f['cell']] = st.text_input(f['label'], key=f['cell'])

with tab4:
    st.header("Bohren & Fräsen")
    # Hier können wir später dynamische Tabellen einbauen (st.data_editor)
    st.info("Dynamische Zeilen für Bohrungen werden in der Web-Version über Tabellen gelöst.")

# --- Excel Logik ---
def generate_excel():
    template_path = config['excel_file']
    wb = openpyxl.load_workbook(template_path)
    ws = wb.active
    
    for cell, value in data_input.items():
        if value:
            ws[cell] = value
            
    # Speichern in einen Buffer für den Download
    buffer = BytesIO()
    wb.save(buffer)
    return buffer.getvalue()

st.divider()
if st.button("RAPPORT GENERIEREN", type="primary", use_container_width=True):
    excel_data = generate_excel()
    st.download_button(
        label="📥 Excel Datei herunterladen",
        data=excel_data,
        file_name=f"Rapport_{datetime.now().strftime('%Y%m%d')}.xlsx",
        mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )