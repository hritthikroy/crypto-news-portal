<div align="center">

# 🚀 CryptoDaily - Your Ultimate Crypto News Hub

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=28&duration=3000&pause=1000&color=3A86FF&center=true&vCenter=true&random=false&width=600&lines=Real-Time+Crypto+News+%F0%9F%93%88;Aggregated+From+Top+Sources+%E2%9A%A1;Built+With+Modern+Tech+%F0%9F%92%BB;Deploy+in+Minutes+%F0%9F%9A%80" alt="Typing SVG" />

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hritthikroy/crypto-news-portal)
[![GitHub stars](https://img.shields.io/github/stars/hritthikroy/crypto-news-portal?style=for-the-badge&logo=github&color=yellow)](https://github.com/hritthikroy/crypto-news-portal/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![Express.js](https://img.shields.io/badge/Express.js-4.18-black.svg?style=for-the-badge&logo=express)](https://expressjs.com)

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="700">

</div>

---

## ✨ What's This? 

**CryptoDaily** is a sleek, minimal, and lightning-fast cryptocurrency news aggregator that pulls real-time updates from top crypto sources. No BS, just news! 📰⚡

<div align="center">

### 🎯 Features That Slap

</div>

<table align="center">
<tr>
<td align="center" width="50%">

### 🔥 **Lightning Fast**
Real-time RSS aggregation from CoinTelegraph, CoinDesk & Crypto.news

</td>
<td align="center" width="50%">

### 🎨 **Clean UI**
Modern, responsive design that works on all devices

</td>
</tr>
<tr>
<td align="center" width="50%">

### 📊 **Smart Categories**
Filter by Bitcoin, Ethereum, DeFi, NFTs, Altcoins & more

</td>
<td align="center" width="50%">

### 🚀 **Easy Deploy**
One-click deployment to Vercel or Heroku

</td>
</tr>
<tr>
<td align="center" width="50%">

### 👀 **View Tracker**
Track article popularity with view counters

</td>
<td align="center" width="50%">

### 💬 **Comments**
Engage with built-in comment system

</td>
</tr>
</table>

<div align="center">

<img src="https://user-images.githubusercontent.com/74038190/212284115-f47cd8ff-2ffb-4b04-b5bf-4d1c14c0247f.gif" width="700">

</div>

---

## 🛠️ Tech Stack

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

---

## 🚀 Quick Start Guide

<div align="center">

### Choose Your Adventure! 🎮

</div>

### 📦 Option 1: Clone & Run (Recommended for Devs)

```bash
# 1️⃣ Clone this bad boy
git clone https://github.com/hritthikroy/crypto-news-portal.git

# 2️⃣ Jump into the directory
cd crypto-news-portal

# 3️⃣ Install dependencies (grab a coffee ☕)
npm install

# 4️⃣ Fire it up! 🔥
npm start

# 5️⃣ Open your browser and visit
# 🌐 http://localhost:3000
```

<div align="center">

<img src="https://user-images.githubusercontent.com/74038190/212257472-08e52665-c503-4bd9-aa20-f5a4dae769b5.gif" width="100">

**Boom! You're live! 🎉**

</div>

### ☁️ Option 2: Deploy to Vercel (Easiest Way)

<div align="center">

**Just click the button below and follow the prompts! 👇**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hritthikroy/crypto-news-portal)

<img src="https://user-images.githubusercontent.com/74038190/212257467-871d32b7-e401-42e8-a166-fcfd7baa4c6b.gif" width="100">

**Live in 30 seconds! ⚡**

</div>

### 🐳 Option 3: Deploy to Heroku

```bash
# 1️⃣ Create a new Heroku app
heroku create your-crypto-news-app

# 2️⃣ Push and deploy
git push heroku main

# 3️⃣ Open your app
heroku open
```

---

## 📁 Project Structure

```
crypto-news-portal/
├── 📄 server.js              # Express server & API endpoints
├── 📄 index.html             # Homepage
├── 📄 post.html              # Article viewer page
├── 📄 about.html             # About page
├── 📁 css/
│   └── style.css             # Stylesheets
├── 📁 js/
│   ├── rss-feed.js           # RSS feed handler
│   └── post.js               # Post page logic
├── 📁 images/                # Image assets
├── 📁 public/                # Static files
├── 📄 package.json           # Dependencies
├── 📄 vercel.json            # Vercel config
└── 📄 README.md              # You are here! 📍
```

---

## 🎯 API Endpoints

<div align="center">

| Endpoint | Description | Example |
|----------|-------------|---------|
| `/` | Homepage | `http://localhost:3000/` |
| `/api/news` | Latest news (100 items) | `GET /api/news` |
| `/api/popular` | Popular news (10 items) | `GET /api/popular` |
| `/api/article?url=<url>` | Specific article details | `GET /api/article?url=...` |
| `/api/related-posts?url=<url>` | Related articles | `GET /api/related-posts?url=...` |
| `/api/view-count?url=<url>` | Article view count | `GET /api/view-count?url=...` |
| `/sitemap.xml` | Dynamic sitemap | `GET /sitemap.xml` |

</div>

---

## 🎨 Features Breakdown

### 🔥 Real-Time News Aggregation
- Pulls from **CoinTelegraph**, **CoinDesk**, and **Crypto.news**
- Updates automatically
- No API keys required!

### 📱 Responsive Design
- Works flawlessly on mobile, tablet, and desktop
- Modern UI with smooth animations
- Dark theme friendly

### 🏷️ Smart Categorization
- Bitcoin, Ethereum, Altcoins, DeFi, NFTs
- Web3, Market Updates, Regulation
- One-click filtering

### 📊 View Counter
- Track article popularity
- Persistent view counts
- Real-time updates

### 💬 Comment System
- Local storage-based comments
- No database needed
- Privacy-friendly

### 🖼️ Article Viewer
- Full-screen mode
- Related posts sidebar
- Ad integration support

---

## 🔧 Environment Variables (Optional)

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=production
```

---

## 🤝 Contributing

<div align="center">

**We love contributions! 💖**

<img src="https://user-images.githubusercontent.com/74038190/212257454-16e3712e-945a-4ca2-b238-408ad0bf87e6.gif" width="100">

</div>

1. 🍴 Fork the repo
2. 🌿 Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. ✍️ Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push to the branch (`git push origin feature/AmazingFeature`)
5. 🎉 Open a Pull Request

---

## 📝 License

<div align="center">

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

</div>

---

## 💪 Built With Love By

<div align="center">

**CryptoDaily Team** 🚀

<img src="https://user-images.githubusercontent.com/74038190/212284158-e840e285-664b-44d7-b79b-e264b5e54825.gif" width="400">

### 🌟 Star this repo if you like it!

[![GitHub stars](https://img.shields.io/github/stars/hritthikroy/crypto-news-portal?style=social)](https://github.com/hritthikroy/crypto-news-portal/stargazers)

</div>

---

## 📞 Support

<div align="center">

Got questions? Found a bug? Want to contribute?

[Open an Issue](https://github.com/hritthikroy/crypto-news-portal/issues) | [Start a Discussion](https://github.com/hritthikroy/crypto-news-portal/discussions)

<img src="https://user-images.githubusercontent.com/74038190/212257465-7ce8d493-cac5-494e-982a-5a9deb852c4b.gif" width="100">

**Made with ❤️ and ☕ by the CryptoDaily Team**

</div>

---

<div align="center">

### 🚀 Ready to Deploy?

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hritthikroy/crypto-news-portal)

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=100&section=footer" width="100%">

</div>
