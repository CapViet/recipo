Here’s a concise GitHub-style README 👇

---

# 🍳 AI Cooking Assistant — RAG Chatbot Recipe Website

An AI-powered cooking website that combines a modern recipe platform with a **Retrieval-Augmented Generation (RAG) chatbot**.
Users can discover recipes, get cooking help, and read AI-generated food articles — all through natural conversation.

---

## ✨ Features

### 🤖 AI Cooking Chatbot (Core Feature)

The built-in chatbot acts as a personal cooking assistant that can:

* Recommend recipes using natural language
* Suggest meals from available ingredients
* Provide step-by-step cooking guidance
* Answer food and cooking questions in real time

Powered by a **RAG pipeline**, the chatbot retrieves real recipes from the database before generating responses → making answers accurate and grounded.

---

### 🥗 Recipe Platform

* Browse and search recipes
* Filter by country or difficulty
* Save favorite recipes
* Comment and rate dishes
* Create and submit your own recipes

---

### 📰 AI Food Article Generator

A second LLM automatically generates food blog posts and cooking articles to enrich the website content.

---

## 🧠 AI Stack

| Component         | Model                   | Purpose                          |
| ----------------- | ----------------------- | -------------------------------- |
| Chatbot           | LLaMA 2 – 7B            | Conversational cooking assistant |
| Article Generator | LLaMA 3.2 – 3B Instruct | Food article generation          |

---

## 🔄 RAG Workflow

1. User asks a question
2. System retrieves relevant recipes from DB
3. Context is injected into prompt
4. LLM generates grounded answer

This prevents hallucinations and ensures responses match real recipes.

---

## 🏗️ Tech Stack

**Frontend**

* Next.js
* TailwindCSS

**Backend**

* FastAPI

**Database**

* PostgreSQL

**AI**

* LLaMA models via Ollama
* RAG architecture

---

## 🎯 Goal

Transform a traditional recipe website into an **interactive AI cooking companion** that helps users cook smarter and discover meals faster.

