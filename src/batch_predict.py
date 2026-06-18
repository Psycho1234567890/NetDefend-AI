"""
===========================================
 NetDefend AI - Batch Prediction
===========================================
Predicts ALL rows in the test dataset and saves results to a CSV.
"""

import pandas as pd
import numpy as np
import joblib
import warnings
warnings.filterwarnings('ignore')  # Clean up the output

# -------------------- LOAD SAVED MODEL --------------------
print("🔍 Loading NetDefend AI model...")
model = joblib.load('netdefend_ai_model.pkl')
scaler = joblib.load('scaler.pkl')
training_cols = joblib.load('training_columns.pkl')
num_cols = joblib.load('num_cols.pkl')
cat_cols = joblib.load('cat_cols.pkl')
print("✅ Model loaded successfully!")

# -------------------- LOAD TEST DATA --------------------
print("📂 Loading test dataset...")
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

test_df = pd.read_csv('KDDTest+.txt', names=columns)
X_test = test_df.drop(['label', 'difficulty'], axis=1)
y_test = test_df['label']
print(f"✅ Loaded {len(test_df)} records.")

# -------------------- PREPROCESS ALL DATA --------------------
print("🛠️ Preprocessing all records...")
raw_encoded = pd.get_dummies(X_test, columns=cat_cols)
raw_encoded = raw_encoded.reindex(columns=training_cols, fill_value=0)

numeric_scaled = scaler.transform(raw_encoded[num_cols].values)
categorical_data = raw_encoded.drop(num_cols, axis=1).values
final_input = np.hstack([numeric_scaled, categorical_data])

# -------------------- MAKE PREDICTIONS --------------------
print("🤖 Running predictions on all records...")
predictions = model.predict(final_input)
prediction_labels = ['Attack 🚨' if p == 1 else 'Normal ✅' for p in predictions]

# -------------------- SAVE RESULTS --------------------
test_df['NetDefend_Prediction'] = prediction_labels
test_df['Is_Attack_Predicted'] = predictions

# Save to CSV
output_file = 'netdefend_full_predictions.csv'
test_df.to_csv(output_file, index=False)
print(f"✅ Predictions saved to '{output_file}'")

# -------------------- SHOW SUMMARY --------------------
print("\n" + "="*50)
print("BATCH PREDICTION SUMMARY")
print("="*50)
print(test_df[['label', 'NetDefend_Prediction']].head(10))  # Show first 10

total_attacks = (predictions == 1).sum()
print(f"\n📊 Total records processed: {len(predictions)}")
print(f"🚨 Predicted as Attack: {total_attacks}")
print(f"✅ Predicted as Normal: {len(predictions) - total_attacks}")
print("="*50)
print("🎉 Batch prediction complete!")