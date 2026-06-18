from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
import os
import json
import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)
CORS(app)  # Allows frontend to call this API

# -------------------- PATHS --------------------
# Get the absolute path to the project root
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # E:\NetDefend AI
MODELS_DIR = os.path.join(BASE_DIR, 'models')
OUTPUT_DIR = os.path.join(BASE_DIR, 'outputs')

# Create outputs folder if it doesn't exist
os.makedirs(OUTPUT_DIR, exist_ok=True)

# -------------------- LOAD AI MODEL --------------------
print("🚀 Loading NetDefend AI Model for API...")
model = joblib.load(os.path.join(MODELS_DIR, 'netdefend_ai_model.pkl'))
scaler = joblib.load(os.path.join(MODELS_DIR, 'scaler.pkl'))
training_cols = joblib.load(os.path.join(MODELS_DIR, 'training_columns.pkl'))
num_cols = joblib.load(os.path.join(MODELS_DIR, 'num_cols.pkl'))
cat_cols = joblib.load(os.path.join(MODELS_DIR, 'cat_cols.pkl'))
THRESHOLD = 0.10
print(f"✅ Model loaded. Threshold: {THRESHOLD}")

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'message': 'NetDefend AI is running!'})

@app.route('/api/filter', methods=['POST'])
def filter_csv():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    try:
        # 1. Load the CSV
        df = pd.read_csv(file.stream)
        total_rows = len(df)
        
        # 2. Prepare features
        X_test = df.copy()
        for col in ['label', 'difficulty', 'binary_label']:
            if col in X_test.columns:
                X_test = X_test.drop(columns=[col])
        
        # 3. Preprocess
        raw_encoded = pd.get_dummies(X_test, columns=cat_cols)
        raw_encoded = raw_encoded.reindex(columns=training_cols, fill_value=0)
        numeric_scaled = scaler.transform(raw_encoded[num_cols].values)
        categorical_data = raw_encoded.drop(num_cols, axis=1).values
        final_input = np.hstack([numeric_scaled, categorical_data])
        
        # 4. Predict
        probabilities = model.predict_proba(final_input)[:, 1]
        predictions = (probabilities >= THRESHOLD).astype(int)
        
        # 5. Add results
        df['attack_confidence'] = probabilities
        df['prediction'] = ['attack' if p == 1 else 'normal' for p in predictions]
        
        # 6. Separate
        attacks_df = df[df['prediction'] == 'attack']
        normal_df = df[df['prediction'] == 'normal']
        
        # 7. Stats
        attack_types = {}
        if 'label' in df.columns:
            attack_types = attacks_df['label'].value_counts().to_dict()
        
        attack_records = attacks_df.head(100).to_dict('records')
        normal_records = normal_df.head(100).to_dict('records')
        
        stats = {
            'total': total_rows,
            'attacks': len(attacks_df),
            'normal': len(normal_df),
            'attack_percentage': round((len(attacks_df) / total_rows) * 100, 2),
            'avg_confidence': round(probabilities.mean(), 4),
            'attack_types': attack_types
        }
        
        # 8. Save CSVs using absolute paths
        attacks_df.to_csv(os.path.join(OUTPUT_DIR, 'filtered_attacks.csv'), index=False)
        normal_df.to_csv(os.path.join(OUTPUT_DIR, 'filtered_normal.csv'), index=False)
        
        return jsonify({
            'success': True,
            'stats': stats,
            'attacks': attack_records,
            'normal': normal_records,
            'download_urls': {
                'attacks': '/download/attacks',
                'normal': '/download/normal'
            }
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/download/<type>')
def download(type):
    if type == 'attacks':
        return send_file(os.path.join(OUTPUT_DIR, 'filtered_attacks.csv'), as_attachment=True)
    else:
        return send_file(os.path.join(OUTPUT_DIR, 'filtered_normal.csv'), as_attachment=True)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)