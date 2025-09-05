# AthletiQon - Train, Test, Triumph 🏅

## Overview

AthletiQon is an **AI-powered mobile platform** designed to democratize sports talent assessment across India and beyond. It enables athletes, even from the most remote regions, to undergo standardized fitness tests using only their smartphones. Leveraging **computer vision, pose estimation, and AI-powered cheat detection**, AthletiQon ensures fair, accurate, and accessible talent identification without the need for expensive equipment.

This project has been ideated as part of **Smart India Hackathon 2025 (SIH 2025)** and aligns with the Government of India’s vision of making sports talent discovery more **inclusive, scalable, and technology-driven**.

---

## Mission

"**Train, Test, Triumph**" — AthletiQon’s mission is to provide every aspiring athlete the opportunity to showcase their abilities, ensuring **merit-based identification** and **data-driven decisions** for sports authorities.

---

## Problem Statement

Currently, fitness assessments for sports talent identification rely heavily on manual evaluation and expensive infrastructure. This creates:

* **Accessibility gaps** for athletes in rural/low-income regions.
* **Inconsistencies** in evaluation methods.
* **High costs** of infrastructure and logistics.
* **Susceptibility to manipulation/cheating** in remote submissions.

There is a pressing need for a **low-cost, mobile-first, AI-based solution** that can assess athletes fairly and consistently while ensuring data authenticity.

---

## Proposed Solution

AthletiQon addresses these challenges through:

1. **Mobile-First AI Application**

   * Built on **Flutter** for cross-platform support (Android + iOS).
   * Works smoothly on **low-end devices**.

2. **On-Device AI Analysis**

   * Pose Estimation using **TensorFlow Lite (MoveNet / MediaPipe BlazePose)**.
   * Real-time inference for reps, form, and performance metrics.

3. **Cheat Detection Mechanism**

   * Detects tampered or duplicate videos.
   * Analyzes unnatural motion patterns, face/body mismatch, and frame anomalies.

4. **Offline-First Functionality**

   * Records and verifies locally.
   * Stores data in an **upload queue** for when internet connectivity is available.

5. **Centralized Dashboard for Officials**

   * Web dashboard built with **React.js + FastAPI/Node.js backend**.
   * Provides analytics, flagged submissions, leaderboards, and exportable reports.

6. **Gamified Athlete Experience**

   * Local-language support.
   * Leaderboards, badges, and progress trackers.

---

## Key Features

* 📱 **Mobile App** for athletes (train + test).
* 🎥 **Guided Video Capture** with on-screen overlays.
* 🤖 **AI-powered Metrics** (jump height, push-up/sit-up count, sprint timing).
* 🔐 **Anti-cheating Module** with heuristic + ML checks.
* 🌐 **Offline & Low-Bandwidth Mode** with resumable uploads.
* 📊 **Admin Dashboard** for SAI/officials.
* 🔒 **Data Privacy**: Minimal storage, encryption, and consent-based sharing.

---

## Tech Stack

### Frontend (Mobile)

* **Flutter (Dart)** for cross-platform development.
* **TensorFlow Lite + MediaPipe** for on-device inference.

### Backend & APIs

* **FastAPI (Python)** or **Node.js + Express** for REST APIs.
* **PostgreSQL** for structured athlete data.
* **MinIO / AWS S3** for video storage (minimal uploads).

### Admin Dashboard

* **React.js** (frontend)
* **FastAPI/Node.js** (backend)
* **TailwindCSS + Chart.js** for analytics visualization.

### AI/ML Modules

* **MoveNet Lightning/Thunder** for real-time pose estimation.
* **Cheat detection model** trained with video forgery datasets.
* **Quantized TFLite Models** for mobile efficiency.

### Infra & DevOps

* **Docker** for containerization.
* **CI/CD pipelines** with GitHub Actions.
* **Secure deployment** on GCP/AWS/DigitalOcean.

---

## Architecture Diagram

1. **Athlete App (Flutter)** → captures video + runs local inference.
2. **On-device AI** → extracts metrics + verifies authenticity.
3. **Local Queue** → stores results offline.
4. **Backend API** → receives secure uploads.
5. **Database + Object Storage** → stores metrics + minimal video evidence.
6. **Dashboard** → enables officials to monitor, review, and export data.

---

## Potential Use Cases

* National talent scouting by **SAI, Khelo India**.
* School/college-level sports assessments.
* NGO-led rural sports talent programs.
* Community fitness events with AI verification.

---

## Evaluation Metrics

* **Accuracy** of motion/rep detection (≥ 95%).
* **Mean Absolute Error (MAE)** in jump height estimation (≤ 3 cm).
* **Cheat detection precision/recall** (≥ 90%).
* **Inference speed**: ≥ 25 FPS on low-end devices.
* **Upload success rate** under poor connectivity (> 95% with retry).

---

## Roadmap

### Phase 1: Prototype (SIH Hackathon)

* Core app with guided video capture.
* Pose estimation & rep counting.
* Basic cheat detection heuristics.
* Demo dashboard with live data.

### Phase 2: Pilot Testing

* Collect real-world test videos.
* Improve accuracy of cheat detection.
* Add multi-language support.

### Phase 3: Scale-Up

* Partner with SAI/Khelo India for state-level rollout.
* Integrate leaderboards, gamification, and advanced analytics.
* Implement blockchain-backed verifications for result authenticity.

---

## Impact

* **Inclusivity**: Empowers rural athletes with equal opportunity.
* **Scalability**: Nationwide adoption at low cost.
* **Transparency**: Prevents manipulation and ensures fair talent discovery.
* **Sustainability**: Cloud-backed, mobile-first, and data-efficient.

---

## Team Roles (Recommended)

* **AI/ML Engineers**: Pose estimation, cheat detection, optimization.
* **Mobile Developers**: Flutter app development.
* **Backend Developers**: API + database integration.
* **UI/UX Designers**: Athlete and admin-facing interfaces.
* **Project Lead/Presenter**: SIH demo, mentor coordination.

---

## Demo Plan for SIH

1. Live demo of athlete recording a test on a low-end Android phone.
2. Real-time on-device AI analysis (rep counting/jump measurement).
3. Offline storage → later upload.
4. Admin dashboard showing metrics & flagged cheating cases.
5. Judges walkthrough of privacy, scalability, and impact.

---

## License

This project will be developed as part of **SIH 2025** and will align with open-source + government collaboration principles. Specific licensing will be decided in coordination with stakeholders (SAI & SIH guidelines).

---

## Motto

**AthletiQon – Train, Test, Triumph.**

Empowering every athlete, everywhere.
