import streamlit as st
import openpyxl
import json
import os
from datetime import datetime
from io import BytesIO
from PIL import Image

# --- Konfiguration laden ---
def load_config():
    with open('config.json', 'r', encoding='utf-8') as f:
        return json.load(f)

config = load_config()

# --- STYLING (Das "CustomTkinter" Look & Feel) ---
st.set_page_config(page_title="HSBAU Rapport-Manager Pro", layout="wide")

# Wir injizieren CSS, um das Design exakt nachzubauen
st.markdown("""
    <style>
    /* Hintergrund der App */
    .stApp { background-color: #E9ECEF; }
    
    /* Die rote Sidebar wie im Code */
    [data-testid="stSidebar"] {
        background-color: #343A40 !important;
        min-width: 260px !important;
    }
    
    /* SectionCard Imitation */
    .section-card {
        background-color: #FFFFFF;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 20px;
        border-bottom: 2px solid #E9ECEF;
    }
    
    .section-title {
        color: #E30613;
        font-family: 'Segoe UI', sans-serif;
        font-weight: bold;
        font-size: 18px;
        margin-bottom: 10px;
    }
    
    /* Rote Buttons */
    .stButton>button {
        background-color: #E30613 !important;
        color: white !important;
        border-radius: 4px !important;
        font-weight: bold !important;
        height: 50px !important;
        width: 100% !important;
    }
    </style>
    """, unsafe_allow_html=True)

# --- SIDEBAR (Logo & Navigation) ---
with st.sidebar:
    # Roter Block für Logo
    st.markdown('<div style="background-color: #E30613; padding: 20px; text-align: center; margin: -60px -20px 20px -20px;">', unsafe_allow_html=True)
    if os.path.exists("huberstraub Logo 1.png"):
        st.image("huberstraub Logo 1.png")
    else:
        st.markdown('<h1 style="color: white; margin: 0;">HUBER<br>STRAUB</h1>', unsafe_allow_html=True)
    st.markdown('</div>', unsafe_allow_html=True)
    
    page = st.radio("MENÜ", ["🏠 Stammdaten", "🕒 Arbeit & Zeit", "📋 Zusatzleistungen", "⚙️ Bohren & Fräsen"])

# --- HAUPTBEREICH ---
data_input = {}

if "Stammdaten" in page:
    st.markdown('<div class="section-card"><div class="section-title">Projektdaten</div>', unsafe_allow_html=True)
    for f in config['static_fields']:
        if f['section'] == "Stammda.":
            data_input[f['cell']] = st.text_input(f['label'], key=f['cell'])
    st.markdown('</div>', unsafe_allow_html=True)

elif "Arbeit & Zeit" in page:
    st.markdown('<div class="section-card"><div class="section-title">Arbeiten</div>', unsafe_allow_html=True)
    for f in config['static_fields']:
        if f['section'] in ["Arbeit", "Zeit"]:
            if f.get('multiline'):
                data_input[f['cell']] = st.text_area(f['label'], key=f['cell'])
            else:
                data_input[f['cell']] = st.text_input(f['label'], key=f['cell'])
    st.markdown('</div>', unsafe_allow_html=True)

# ... (Andere Seiten folgen dem gleichen Muster)

# --- SPEICHER-BUTTON (Immer sichtbar am Ende der Sidebar oder unten) ---
with st.sidebar:
    st.markdown("---")
    if st.button("RAPPORT SPEICHERN"):
        # Excel Logik (identisch mit deinem vorigen Code)
        wb = openpyxl.load_workbook(config['excel_file'])
        ws = wb.active
        for cell, val in data_input.items():
            ws[cell] = val
        
        buffer = BytesIO()
        wb.save(buffer)
        st.download_button("Datei jetzt herunterladen", buffer.getvalue(), "Rapport.xlsx")