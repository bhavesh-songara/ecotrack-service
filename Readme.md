# EcoTrack Service

EcoTrack Service is the powerhouse behind the EcoTrack Chrome extension, empowering users to make impactful, sustainable product choices by delivering cutting-edge insights on product sustainability.

## Features

- Seamlessly integrates environmental reports for brands via Google Cloud Pub/Sub.
- Deploys the formidable Gemini 1.5 Pro AI model to dissect and evaluate product sustainability with precision.
- Delivers comprehensive sustainability intelligence, including:
  - Carbon footprint analysis
  - Recycling options
  - Advanced sustainability tips
  - Brand initiatives and commitments
- Harnesses the power of image recognition to scan and rigorously analyze product images.

## Tech Stack

- **Backend Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Cloud Services**:
  - Google Cloud Pub/Sub
  - Google Cloud Vertex AI
- **AI/ML**: Gemini 1.5 Pro
- **Additional Libraries**:
  - Axios for HTTP requests
  - cls-hooked for async hooks
  - CORS for Cross-Origin Resource Sharing
  - dotenv for environment variable management
  - Joi for data validation
  - jsdom for DOM manipulation
  - Lodash for utility functions
  - pdf-parse for parsing PDF documents
  - UUID for generating unique identifiers
  - Winston for logging

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/bhavesh-songara/ecotrack-service.git
   cd ecotrack-service

   ```

2. **Install dependencies:**

   ```bash
    npm install

   ```

3. **Set up environment variables:**

   - Follow the example.env file for .env structure.
   - Create a .env file in the root directory and add the necessary environment variables.

4. **Start the server:**

   ```bash
   npm run dev
   ```
