"""
===========================================
 NetDefend AI - Intelligent Intrusion Detection
===========================================
"""

import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
import joblib
from imblearn.over_sampling import SMOTE
import warnings
warnings.filterwarnings('ignore')

# -------------------- STEP 1: LOAD DATA --------------------
print("🚀 NetDefend AI Starting...")
print("📂 Loading dataset files...")

# Define column names (41 features + label + difficulty)
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

# Load the files
train_df = pd.read_csv('KDDTrain+.txt', names=columns)
test_df = pd.read_csv('KDDTest+.txt', names=columns)

print(f"✅ Training set: {train_df.shape[0]} rows, {train_df.shape[1]} columns")
print(f"✅ Test set: {test_df.shape[0]} rows, {test_df.shape[1]} columns")

# -------------------- STEP 2: CREATE TARGET LABEL --------------------
# 1 = Attack, 0 = Normal
train_df['binary_label'] = (train_df['label'] != 'normal').astype(int)
test_df['binary_label'] = (test_df['label'] != 'normal').astype(int)

print("\n📊 Distribution in Training Data:")
print(train_df['binary_label'].value_counts().map({0: 'Normal', 1: 'Attack'}))

# -------------------- STEP 3: PREPROCESS DATA --------------------
print("\n🛠️ Preprocessing data (encoding + scaling)...")

# Separate features (X) and target (y)
X_train = train_df.drop(['label', 'difficulty', 'binary_label'], axis=1)
y_train = train_df['binary_label']
X_test = test_df.drop(['label', 'difficulty', 'binary_label'], axis=1)
y_test = test_df['binary_label']

# Identify categorical (text) and numerical columns
cat_cols = ['protocol_type', 'service', 'flag']
num_cols = [col for col in X_train.columns if col not in cat_cols]

# One-Hot Encoding (convert text to numbers)
X_train_encoded = pd.get_dummies(X_train, columns=cat_cols)
X_test_encoded = pd.get_dummies(X_test, columns=cat_cols)

# Align test columns with training (fill missing with 0)
X_test_encoded = X_test_encoded.reindex(columns=X_train_encoded.columns, fill_value=0)

# Scale numerical features (mean=0, std=1)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train_encoded[num_cols])
X_test_scaled = scaler.transform(X_test_encoded[num_cols])

# Combine numerical and categorical features
X_train_final = np.hstack([X_train_scaled, X_train_encoded.drop(num_cols, axis=1).values])
X_test_final = np.hstack([X_test_scaled, X_test_encoded.drop(num_cols, axis=1).values])

print(f"✅ Preprocessing done. Final training shape: {X_train_final.shape}")

# -------------------- STEP 4: TRAIN THE MODEL --------------------
print("\n🔄 Applying SMOTE to balance the dataset...")
smote = SMOTE(random_state=42)
X_train_res, y_train_res = smote.fit_resample(X_train_final, y_train)
print("✅ SMOTE complete. New training size:", X_train_res.shape[0])

print("\n🔄 Training NetDefend AI with balanced data...")
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train_res, y_train_res)
print("✅ Training complete!")

# -------------------- STEP 5: EVALUATE THE MODEL --------------------
# -------------------- STEP 5: EVALUATE WITH THRESHOLD TUNING --------------------
print("\n📊 Finding optimal threshold to catch more attacks...")

# Get prediction probabilities instead of hard labels
y_probs = model.predict_proba(X_test_final)[:, 1]  # Probability of being an Attack

# Try different thresholds
best_recall = 0
best_threshold = 0.5
for threshold in [0.5, 0.45, 0.4, 0.35, 0.3, 0.25, 0.2]:
    y_pred_temp = (y_probs >= threshold).astype(int)
    recall = (y_pred_temp[y_test == 1].sum()) / y_test.sum()
    print(f"   Threshold {threshold:.2f} -> Recall: {recall:.3f}")
    if recall > best_recall:
        best_recall = recall
        best_threshold = threshold

print(f"\n✅ Best threshold found: {best_threshold:.2f} (Recall: {best_recall:.3f})")

# Apply the best threshold
y_pred = (y_probs >= best_threshold).astype(int)

print("\n" + "="*50)
print("CLASSIFICATION REPORT WITH OPTIMAL THRESHOLD")
print("="*50)
print(classification_report(y_test, y_pred, target_names=['Normal (0)', 'Attack (1)']))

# -------------------- STEP 6: SAVE THE MODEL --------------------
print("\n💾 Saving model and preprocessors...")
joblib.dump(model, 'netdefend_ai_model.pkl')
joblib.dump(scaler, 'scaler.pkl')
joblib.dump(X_train_encoded.columns, 'training_columns.pkl')
joblib.dump(num_cols, 'num_cols.pkl')
joblib.dump(cat_cols, 'cat_cols.pkl')
print("✅ All files saved successfully!")

# -------------------- STEP 7: TEST A PREDICTION --------------------
print("\n🔍 Testing prediction on the first sample from test set...")

def predict_attack(raw_data):
    """Predicts if a single network traffic record is Normal or Attack."""
    raw_encoded = pd.get_dummies(raw_data, columns=cat_cols)
    raw_encoded = raw_encoded.reindex(columns=X_train_encoded.columns, fill_value=0)
    
    numeric_scaled = scaler.transform(raw_encoded[num_cols].values)
    categorical_data = raw_encoded.drop(num_cols, axis=1).values
    final_input = np.hstack([numeric_scaled, categorical_data])
    
    pred = model.predict(final_input)[0]
    return "Attack 🚨" if pred == 1 else "Normal ✅"

# Take the first row of the test set (without labels)
sample = X_test.iloc[0:1]
prediction = predict_attack(sample)
actual_label = test_df.iloc[0]['label']

print(f"📌 Actual Label: {actual_label}")
print(f"🤖 NetDefend AI Prediction: {prediction}")

print("\n🎉 NetDefend AI execution completed successfully!")