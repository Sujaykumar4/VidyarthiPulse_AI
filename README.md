# VidyarthiPulse

VidyarthiPulse is an AI-powered educational technology platform engineered to deliver instant, high-quality, and context-aware academic explanations for students. By leveraging advanced multimodal artificial intelligence, the platform allows students to upload images of equations, handwritten notes, or printed questions, and receive structured, step-by-step guidance. 

This repository serves as the core codebase, open for hackathon participants, developers, and open-source contributors to build, scale, and innovate upon the current architecture.

---

## The Problem Statement

Traditional educational setups often struggle to provide personalized, real-time feedback to students when they encounter academic bottlenecks outside the classroom. Existing solutions are either costly (private tutoring) or lack interactive, step-by-step guidance that explains *why* a solution works rather than just providing the final answer. 

VidyarthiPulse addresses this gap by creating an AI-driven, accessible, and scalable doubt-resolution engine. The goal of this project is to democratize quality education, making high-level academic support available to every student, anywhere, at any time.

---

## Key Features

* **Multimodal Doubt Resolution:** Supports text inputs and images of handwritten or printed questions.
* **Intelligent Concept Breakdown:** Automatically extracts formulas, defines core concepts, and structures answers sequentially.
* **Adaptive Knowledge Evaluation:** Generates context-based quick quizzes dynamically to assess and reinforce student understanding.
* **Exportable Study Material:** Formats explanations into clean, print-ready summaries that can be saved as PDFs or shared as plain text.

---

## Technical Stack

* **Frontend:** React 19, Vite, Tailwind CSS, Motion (Framer)
* **Backend:** Node.js, Express, TypeScript
* **Artificial Intelligence:** Google GenAI SDK (Gemini 2.5 Flash)
* **Database & Auth:** Firebase Integration (Authentication and Configuration)

---

## Getting Started

### Prerequisites

* Node.js (v18 or higher)
* npm or yarn package manager
* Google Gemini API Key

### Installation and Local Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Sujaykumar4/vid.git
   cd vid
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory based on `.env.example`:
   ```env
   GEMINI_API_KEY="your_gemini_api_key_here"
   APP_URL="http://localhost:3000"
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The local application will launch and be accessible at `http://localhost:3000`.

---

## Contributing

We welcome contributions from the developer community and hackathon participants. To contribute:

1. Fork the repository.
2. Create a new feature branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes with clear, professional commit messages.
4. Push to your branch and open a Pull Request.

---

## License

This project is open-source software licensed under the MIT License.
