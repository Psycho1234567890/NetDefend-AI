"""
===========================================
 NetDefend AI - Export Filtered CSVs
===========================================
Generates 2 CSV files from your raw data:
1. filtered_attacks.csv  (Malicious traffic)
2. filtered_normal.csv   (Safe traffic)
"""

import pandas as pd
import numpy as np
import joblib
import warnings
warnings.filterwarnings('ignore')

print("🚀 Loading NetDefend AI Model...")

# Load model and preprocessors
model = joblib.load('netdefend_ai_model.pkl')
scaler = joblib.load('scaler.pkl')
training_cols = joblib.load('training_columns.pkl')
num_cols = joblib.load('num_cols.pkl')
cat_cols = joblib.load('cat_cols.pkl')
THRESHOLD = 0.10  # Using your aggressive 0.10 threshold to catch stealth attacks!

print("✅ Model loaded successfully!")
print(f"⚙️  Using threshold: {THRESHOLD}\n")

# -------------------- LOAD YOUR RAW DATA --------------------
# Define the 43 column names (41 features + label + difficulty)
columns = [
    'duration', 'protocol_type', 'service', 'flag', 'src_bytes', 'dst_bytes',
    'land', 'wrong_fragment', 'urgent', 'hot', 'num_failed_logins', 'logged_in',
    'num_compromised', 'root_shell', 'su_attempted', 'num_root', 'num_file_creations',
    'num_shells', 'num_access_files', 'num_outbound_cmds', 'is_host_login',
    'is_guest_login', 'count', 'srv_count', 'serror_rate', 'srv_serror_rate',
    'rerror_rate', 'srv_rerror_rate', 'same_srv_rate', 'diff_srv_rate',
    'srv_diff_host_rate', 'dst_host_count', 'dst_host_srv_count',
    'dst_host_same_srv_rate', 'dst_host_diff_srv_rate', 'dst_host_same_src_port_rate',
    'dst_host_srv_diff_host_rate', 'dst_host_serror_rate', 'dst_host_srv_serror_rate',
    'dst_host_rerror_rate', 'dst_host_srv_rerror_rate', 'label', 'difficulty'
]

print("📂 Loading KDDTest+.txt...")
df = pd.read_csv('KDDTest+.txt', names=columns)
print(f"✅ Loaded {len(df)} rows.\n")

# Separate features (drop label and difficulty for prediction)
X_test = df.drop(['label', 'difficulty'], axis=1)

# -------------------- PREPROCESS ALL DATA --------------------
print("🛠️ Preprocessing data for AI analysis...")
raw_encoded = pd.get_dummies(X_test, columns=cat_cols)
raw_encoded = raw_encoded.reindex(columns=training_cols, fill_value=0)

numeric_scaled = scaler.transform(raw_encoded[num_cols].values)
categorical_data = raw_encoded.drop(num_cols, axis=1).values
final_input = np.hstack([numeric_scaled, categorical_data])

# -------------------- RUN PREDICTIONS --------------------
print("🤖 Running AI threat detection...")
probabilities = model.predict_proba(final_input)[:, 1]  # Confidence scores (0 to 1)
predictions = (probabilities >= THRESHOLD).astype(int)

# Add results back to the original DataFrame
df['Confidence'] = probabilities
df['AI_Prediction'] = ['Attack' if p == 1 else 'Normal' for p in predictions]

# -------------------- FILTER AND SAVE 2 CSV FILES --------------------
attacks_df = df[df['AI_Prediction'] == 'Attack']
normal_df = df[df['AI_Prediction'] == 'Normal']

# Save the files
attacks_df.to_csv('filtered_attacks.csv', index=False)
normal_df.to_csv('filtered_normal.csv', index=False)

# -------------------- SHOW SUMMARY --------------------
print("\n" + "="*50)
print("✅ FILTERING COMPLETE!")
print("="*50)
print(f"📊 Total records processed: {len(df)}")
print(f"🚨 Attacks filtered out (Block List): {len(attacks_df)}")
print(f"✅ Normal safe traffic (Allow List): {len(normal_df)}")
print("\n📁 Files saved in your current folder:")
print(f"   1. filtered_attacks.csv  (Contains {len(attacks_df)} malicious rows)")
print(f"   2. filtered_normal.csv   (Contains {len(normal_df)} safe rows)")
print("="*50)
print("🎉 Open these files in Excel or Notepad to view the filtered data!")