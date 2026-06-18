# 🛡️ NetDefend AI

**NetDefend AI** is an intelligent, real-time Network Intrusion Detection System (NIDS) built using Machine Learning. It analyzes network traffic to instantly classify connections as **Normal** or **Attack** (Malicious).

- **Accuracy:** 86%
- **Attack Recall:** 78% (with threshold tuning)
- **Technology:** Python, Scikit-Learn, Random Forest, SMOTE, Flask.

---

## 🚀 Features

- ✅ **Batch Prediction:** Analyze entire CSV files (e.g., `batch_predict.py`).
- ✅ **Live Web Dashboard:** Interactive UI to test Normal vs Attack traffic.
- ✅ **Data Filtering Engine:** Upload a CSV, and the AI automatically filters out malicious traffic into separate files.
- ✅ **REST API:** Deployable endpoint to integrate with firewalls.
- ✅ **Threshold Tuning:** Adjustable sensitivity (0.10 used for high recall).

---

## 📁 Project Structure
NetDefend-AI/
├── app/ # Web Applications (Flask)
│ ├── api_server.py # Live Dashboard
│ └── data_filter_web.py # CSV Upload & Filter
├── src/ # Core ML Scripts
│ ├── netdefend_ai.py # Training script
│ └── generate_2_csvs.py # Filter CSV generator
├── models/ # Saved AI Artifacts
│ ├── netdefend_ai_model.pkl
│ ├── scaler.pkl
│ └── ...
├── data/ # Datasets (NSL-KDD)
└── outputs/ # Generated Output CSVs