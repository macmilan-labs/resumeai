# ResumeAI

Modern AI-powered ATS Resume Analyzer built with React, Node.js, Express, and Google Gemini.

ResumeAI helps job seekers evaluate how well their resume matches a target job description by identifying missing skills, keyword gaps, ATS optimization opportunities, and actionable improvements.

---

## Overview

Recruiters often use Applicant Tracking Systems (ATS) to filter resumes before a human ever sees them. ResumeAI analyzes a candidate's resume against a job description and provides detailed insights to improve ATS compatibility and overall application quality.

This project was developed as a full-stack learning project focused on:

* React application architecture
* Authentication systems
* REST API development
* AI integration using Google Gemini
* Resume analysis workflows
* Modern SaaS-style UI/UX design

---

## Features

### ATS Resume Analysis

* Resume vs Job Description comparison
* ATS compatibility scoring
* Skill matching analysis
* Missing skill detection
* Keyword gap analysis
* Experience relevance scoring

### AI-Powered Insights

* Resume summary evaluation
* Priority improvement recommendations
* Resume verdict generation
* Bullet point rewrite suggestions
* Recruiter readability feedback

### User Features

* Google Authentication
* Free and Pro account simulation
* User-specific analysis history
* Delete individual reports
* Clear entire history
* Persistent report storage

### Modern UI

* Multi-page architecture
* Responsive design
* Premium dashboard experience
* Smooth animations and transitions
* Professional blue-orange design system

---

## Application Pages

### Landing Page

Introduction to the platform, value proposition, and call-to-action.

### Analyze

Workspace for submitting resumes and job descriptions.

### Results

Detailed ATS analysis dashboard including:

* ATS Score
* Skill Alignment
* Critical Gaps
* Resume Verdict
* Priority Fixes
* AI Rewrite Suggestions

### History

Track previous resume analyses and manage saved reports.

### Pricing

Example SaaS pricing structure and upgrade flow.

---

## Tech Stack

### Frontend

* React
* React Router DOM
* Tailwind CSS
* Context API
* Vite

### Backend

* Node.js
* Express.js

### AI

* Google Gemini API

### Data Storage

* JSON-based persistence system

---

## Project Structure

resumeai/

├── client/          # React Frontend

├── server/          # Express Backend

├── README.md

├── package.json

└── package-lock.json

---

## Installation

### Clone Repository

git clone https://github.com/macmilan-labs/resumeai.git

cd resumeai

### Install Dependencies

npm install

cd client

npm install

cd ../server

npm install

### Configure Environment Variables

Create:

server/.env

Add:

GEMINI_API_KEY=your_api_key_here

PORT=5000

### Start Backend

cd server

npm run dev

### Start Frontend

cd client

npm run dev

Frontend:

http://localhost:5173

Backend:

http://localhost:5000

---

## Learning Outcomes

Through building ResumeAI, I gained practical experience with:

* Full-stack application development
* React state management
* Authentication workflows
* API integration
* Prompt engineering
* Modern UI/UX design
* Project structure and scalability
* Git and GitHub workflows

---

## Future Improvements

* PDF Resume Upload
* Resume Parsing Engine
* Exportable ATS Reports
* LinkedIn Profile Analysis
* Interview Preparation Assistant
* Database Integration
* Admin Dashboard
* Resume Version Tracking

---

## Disclaimer

ResumeAI is a portfolio and educational project created to explore AI-powered resume optimization workflows. The ATS analysis and recommendations are intended for learning and demonstration purposes.

---

## Author

Macmilan Cyril

GitHub:
https://github.com/macmilan-labs
