# 🌍 Velora Travel App

**Discover India's Hidden Gems with Velora**

Velora is a modern, full-stack travel booking and exploration application designed to inspire your next journey. With a stunning cinematic UI, live weather integration, dark/light mode support, and seamless booking links, Velora takes the hassle out of travel planning.

## 🚀 Live Demo
**[Experience Velora Live on Vercel](https://velora-travel-app.vercel.app)**  
*(Note: If your Vercel URL is different, please update this link!)*

## ✨ Key Features
- **Cinematic Experience**: Immersive video heroes, dynamic skies, and high-quality destination galleries.
- **Theme Engine**: Fully integrated Light and Dark mode that shifts instantly based on user preference.
- **Smart Dashboard**: A beautifully designed user dashboard to track saved trips, upcoming journeys, and travel DNA stats.
- **Live Weather**: Real-time weather data powered by OpenWeatherMap API for every destination.
- **Third-Party Integration**: Direct booking redirect links to Booking.com and OYO Rooms.
- **Hybrid Database**: Built with a flexible storage engine that defaults to LocalStorage but instantly scales to Firebase just by dropping in your API keys!

## 🛠 Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion (for smooth animations)
- **State Management**: React Context API
- **Icons**: Lucide React
- **Hosting**: Vercel Ready

## 📦 Getting Started Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/Abhilash-ai/Velora-Travel-App.git
   cd Velora-Travel-App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## 🔐 Environment Variables (Optional)
By default, Velora runs flawlessly on LocalStorage. However, if you want to unlock live Maps and a true Firebase Backend, create a `.env` file in the root directory:

```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 🤝 Contributing
Contributions are always welcome! Feel free to open an issue or submit a pull request.
