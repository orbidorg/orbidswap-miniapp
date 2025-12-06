# <div align="center"><img src="public/logo.svg" alt="OrbidSwap Logo" width="120" /></div>

<div align="center">

# OrbidSwap Mini App
**The Native DEX for World App**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![MiniKit](https://img.shields.io/badge/MiniKit-v2-black)](https://docs.world.org/minikit)
[![World Chain](https://img.shields.io/badge/World_Chain-Mainnet-7B3FE4)](https://worldcoin.org/)

[Open in World App](https://worldcoin.org/mini-app?app_id=app_...) • [Documentation](https://docs.orbidswap.org)

</div>

---

## 📱 Overview

This is the **Mini App** version of OrbidSwap, specifically optimized to run inside **World App**. It features a streamlined UI, native MiniKit integration, and simplified flows for mobile users.

### Key Differences

| Feature | Web App | Mini App |
|---------|---------|----------|
| **Environment** | Browser (Desktop/Mobile) | World App (Mobile) |
| **Connection** | WalletConnect / Injected | MiniKit (Native) |
| **Network** | World Chain Sepolia | World Chain Mainnet |
| **UI/UX** | Full Dashboard | Touch-Optimized |

---

## ✨ Features

- **👆 One-Tap Connect**: Seamless login with World App credentials.
- **⚡ Fast Swaps**: Optimized for mobile networks.
- **🆔 Verified Access**: Instant World ID verification.
- **🎨 Native Feel**: Adapts to World App's theme and navigation.

---

## 🛠️ Development

### Prerequisites

- Node.js 18+
- [World App Simulator](https://docs.world.org/minikit/simulator) (recommended)
- Ngrok or similar tunneling service (for local dev testing in Simulator)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/orbidorg/orbidswap-miniapp.git
   cd orbidswap-miniapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

### Testing in World App Simulator

1. Start your local server (`npm run dev`).
2. Expose your localhost via ngrok: `ngrok http 3000`.
3. Open the **World App Developer Portal**.
4. Create a new app or edit existing one.
5. Set the "Development URL" to your ngrok URL.
6. Open the Simulator and scan the QR code.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <sub>Built with ❤️ for the World Chain Ecosystem</sub>
</div>
