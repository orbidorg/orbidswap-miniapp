# 🌐 OrbIdSwap Mini App

**Human-First DeFi for World Chain** — Mini App version optimized for World App integration.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 🔗 World App Integration

This version includes:

- **MiniKitProvider** — Wraps the app for World App context
- **MiniKitDetector** — Detects if running inside World App
- **World App Badge** — Shows when running in World App
- **Optimized UI** — Simplified for mobile World App experience

## 📦 Key Differences from External Version

| Feature | External | Mini App |
|---------|----------|----------|
| MiniKit | ❌ | ✅ |
| Theme Toggle | ✅ | Hidden (uses World App theme) |
| Search Bar | ✅ | Hidden (cleaner UI) |
| Connect Button | "Connect Wallet" | "Connect" |
| World App Badge | ❌ | ✅ (when in World App) |

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📱 Testing in World App

1. Deploy to a public URL (Vercel recommended)
2. Register app in World Developer Portal
3. Scan the QR code in World App Simulator

---

Built with ❤️ in Colombia 🇨🇴 for the World Chain ecosystem
