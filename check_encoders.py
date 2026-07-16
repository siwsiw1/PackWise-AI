import joblib

try:
    encoders = joblib.load("backend/label_encoders.pkl")
    for name, encoder in encoders.items():
        print(f"Encoder: {name}")
        print(f"  Classes: {list(encoder.classes_)}")
except Exception as e:
    print("Error:", e)
