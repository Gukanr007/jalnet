# 💧 JALNET – Smart Rural Water Supply Management System

**JALNET** stands for **Jal** (Water) + **Net** (Network), representing a smart and connected platform for managing rural water infrastructure under India's **Jal Jeevan Mission**. It is a responsive web application built using **React** and **Supabase**, designed to digitize rural water supply operations with GIS mapping, maintenance tracking, billing, and manual inventory control.

**Demo Link:** https://jalnet.netlify.app/

---

## 🔍 Project Objective

- Digitize rural water supply management.
- Enable citizens to pay water bills without login using their **Water ID**.
- Provide **GIS-based asset tracking** for pipelines, valves, pumps, and taps.
- Allow **admins and workers** to log in and manage maintenance tasks.
- Support **manual inventory management** with low-tech accessibility.
- Work in low-connectivity rural areas with **offline-first features**.

---

## 🚀 Features

### 👤 User Roles

- **Admin (JE/AE)**: Manage assets, assign tasks, oversee billing and inventory.
- **Worker (Plumber/Technician)**: View assigned maintenance or restocking tasks.
- **Citizen**: Pay water bills and report water issues using Water ID (no login required).

### 🗺️ GIS Mapping

- Interactive map view of water infrastructure.
- Assets color-coded by condition: green (good), blue (average), yellow (poor).
- City and area-based filtering (default: Pondicherry > Muthialpet).
- Clickable markers with popups showing asset details and actions.

### 🛠️ Maintenance Module

- Threshold-based task scheduling (e.g., pipe = every 5 years).
- Workers can update task status (assigned, in progress, completed).
- Admin view of upcoming and overdue tasks.

### 💼 Inventory Module

- Manual inventory tracking (e.g., chlorine, filters).
- Threshold alerts for restocking.
- Admin-to-worker restocking assignments.

### 💳 Billing System

- Citizens check bill status using Water ID.
- Simulated payments via UPI, card, or offline entry.
- Displays past transactions and payment history.

### 📱 Mobile-Responsive & Offline Support

- Fully responsive web app (mobile-first design).
- Offline usability with local caching (for remote rural access).
- Multilingual support (planned in future releases).

---

## 🏗️ Tech Stack

| Component      | Technology                            |
| -------------- | ------------------------------------- |
| Frontend       | React + TailwindCSS                   |
| Backend        | Supabase (PostgreSQL, Auth, Storage)  |
| GIS Mapping    | Leaflet.js / Mapbox / Google Maps API |
| Payment (Mock) | Razorpay / Dummy flow                 |
| Deployment     | Vercel / Netlify (suggested)          |

---

## 🧪 Simulated Dataset (For Demo)

- 5 pipelines, 3 pumps, 2 valves, 5 household taps (geo-mapped).
- Users: `admin@jalnet.in`, `worker@jalnet.in` (demo accounts).
- Sample Water IDs: `WID-MUT-RANG001`, `WID-MUT-SUMI002`.

---

## 📦 Project Structure

```
/jalnet
├── android/
├── public/
│   ├── favicon.ico
│   ├── lovable-uploads/
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── App.css
│   ├── App.tsx
│   ├── components/
│   ├── contexts/
│   ├── data/
│   ├── hooks/
│   ├── index.css
│   ├── integrations/
│   ├── lib/
│   ├── main.tsx
│   ├── pages/
│   ├── types/
│   └── vite-env.d.ts
├── supabase/
│   └── config.toml
├── .env
├── .gitignore
├── bun.lockb
├── capacitor.config.ts
├── components.json
├── dist/
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── README.md
├── setup-env.js
├── tailwind.config.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
```

---

## ⚙️ How to Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/your-username/jalnet.git
cd jalnet

# 2. Set up environment variables
npm run setup-env
# This will create a .env file with the required environment variables.
# Edit the .env file and replace "your_google_maps_api_key_here" with your actual API key.
#
# To get a Google Maps API key:
# 1. Go to https://console.cloud.google.com/
# 2. Create a new project or select existing one
# 3. Enable Maps JavaScript API
# 4. Create credentials (API key)
# 5. Add the API key to your .env file

# 3. Install dependencies
npm install

# 4. Set up Supabase project
# → Import schema.sql into your Supabase project
# → Create .env file with Supabase keys

# 5. Start the development server
npm run dev
```

---

## 📈 Future Scope

- Integrate real-time IoT monitoring for flow, pressure, and leakage.
- Add AI-based prediction for maintenance and inventory needs.
- Launch offline-first mobile app with multilingual support.
- Scale the system to more rural areas under Jal Jeevan Mission.

---

## 📝 License

This project is for academic and prototype purposes.  
Contact me before any commercial or extended usage.

---

## 🌐 References

- Jal Jeevan Mission Official Dashboard: [https://ejalshakti.gov.in](https://ejalshakti.gov.in)
- IEEE & Research References: See project report or presentation.
- [Gukan R, "JALNET: Smart Rural Water Supply Management System," 2024 IEEE Paper, https://ieeexplore.ieee.org/document/10894932](https://ieeexplore.ieee.org/document/10894932)

---
