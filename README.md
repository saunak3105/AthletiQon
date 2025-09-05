# 🐄 athletiQon – train, test, triumph

An **AI-powered livestock recognition system** for accurate identification of **cattle (cow)** and **buffaloes** from images.  
Built for **Smart India Hackathon 2025 (SIH25004)**.  

---

## 🌍 Problem Statement

India has **300+ million cattle and buffaloes**, and distinguishing between them is **not trivial**.  
This distinction impacts:

- 🥛 **Dairy Industry** → Cow milk vs Buffalo milk differ in fat %, pricing, and nutritional use.  
- 📊 **Livestock Census & Management** → Accurate classification helps in planning subsidies, fodder, and vaccination.  
- 🛡 **Fraud Prevention** → Farmers may mix cow milk and sell it at buffalo prices.  
- 💉 **Veterinary Healthcare** → Cows and buffaloes differ in disease susceptibility and treatment.  
- 🔐 **Insurance & Theft Prevention** → Correct identification is vital for claims and stolen livestock verification.  

---

## 🎯 Our Solution

**athletiQon** uses **deep learning models** (EfficientNet, DenseNet) for **image-based classification**:  

✅ Input → Animal Image (captured via phone or uploaded)  
✅ Output → Predicted Class: **Cow** 🐄 or **Buffalo** 🐃  

### Why it matters:
- Fair pricing for farmers.  
- Transparency in dairy cooperatives.  
- Automated, scalable livestock census.  
- Better animal healthcare support.  

---

## 🧠 Technical Approach

### 1. Data Preprocessing
- **Resizing** → 224×224 pixels (EfficientNet/DenseNet input size).  
- **Normalization** → Applied ImageNet mean & std.  
- **Augmentation** → Horizontal flips, rotations, brightness/contrast jitter → ensures robustness in real-world field conditions.  

### 2. Architectures Used
- **EfficientNet (B0–B7)**  
  - Lightweight (B0 → good for mobile apps).  
  - Scalable (B7 → high accuracy for backend servers).  
- **DenseNet (121/169/201)**  
  - Densely connected → better feature reuse.  
  - Handles subtle visual differences (horn shape, face structure, body).  

### 3. Training
- **Transfer Learning** with ImageNet pretrained weights.  
- Loss Function → **CrossEntropyLoss**.  
- Optimizer → **Adam** (lr=0.0001).  
- Metrics → Accuracy, Precision, Recall, F1.  

---

## 📊 Dataset Format

Organized in [PyTorch ImageFolder](https://pytorch.org/vision/stable/datasets.html#imagefolder) format:

