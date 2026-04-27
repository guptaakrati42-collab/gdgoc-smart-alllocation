# 📊 Data-Driven Volunteer Coordination for Social Impact

## 🚀 Overview
This project is a smart web-based system designed to help NGOs and local community groups manage and respond to community issues efficiently.

It collects user-reported problems, analyzes them using AI, assigns priority, categorizes the issue, and connects it with the most suitable volunteer.

---

## 🎯 Objective
- Centralize scattered community data  
- Identify urgent issues using AI  
- Assign tasks to volunteers efficiently  
- Improve response time and coordination  

---

## 🧠 Features

### 👤 User Module
- OTP-based login (Firebase Authentication)
- Submit issues (text + voice input)
- AI-based analysis (category & priority)
- View assigned volunteer details

### 🧑‍🔧 Volunteer Module
- Register as volunteer
- Select profession (Medical / Electrician / Plumber)
- Get assigned issues

### 🤖 AI Integration
- Uses Gemini API
- Detects:
  - Category (Medical / Electrician / Plumber)
  - Priority (High / Low)
- Handles invalid inputs
- Includes fallback logic

### ☁️ Database
- Firebase Firestore
- Stores:
  - Issue text
  - Category
  - Priority
  - Assigned volunteer
  - Phone number
  - Timestamp

### 🎤 Voice Input
- Web Speech API
- Hindi voice support (hi-IN)

---

## 🏗️ Tech Stack
- Frontend: HTML, CSS, JavaScript  
- Backend: Firebase Cloud Functions  
- Database: Firebase Firestore  
- Auth: Firebase Authentication (OTP)  
- AI: Gemini API  
- Voice: Web Speech API  

---

## 🔄 Workflow
1. User logs in using OTP  
2. User submits problem  
3. Input validation  
4. AI processes input  
5. Category & priority generated  
6. Volunteer assigned  
7. Data saved in Firestore  
8. Result displayed  

---

## 📂 Database Structure

Issues (collection)
Issues
└── autoID
├── text
├── category
├── priority
├── assignedTo
├── phone


---

## ⚠️ Error Handling
- Invalid input → shows message
- API quota exceeded → retry/fallback
- Undefined AI response → prevents DB save
- Network error → handled gracefully

---

## 🧪 Prototype Behavior
- User sees: "Issue Submitted Successfully"
- Admin/NGO sees: Full AI analysis + database data

---

## 🔮 Future Scope
- Admin dashboard
- Real-time updates
- Location-based tracking
- Notifications
- Mobile app

---

## 👩‍💻 Author
Developed as a prototype for social impact and smart volunteer coordination.

---

## ⭐ Conclusion
This project shows how AI and data can improve community service by making issue handling faster and more efficient.