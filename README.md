
# 🚀 QueueUp Pro

QueueUp Pro is a smart, QR-based queue management system designed for businesses like barber shops, clinics, cafes, and any service provider managing in-person queues. This web-based application streamlines customer flow, reduces wait times, and improves customer satisfaction with real-time queue updates and an interactive kiosk mode.

---

## 🌟 Features

- ✅ **QR Code Queue Access**  
  Customers can scan a QR code to join the queue instantly.

- 📺 **Kiosk/Monitor Display Mode**  
  Display live queues on an in-store screen for customers and staff.

- 🔄 **Real-Time Queue Updates**  
  Both customers and staff see live updates as queues progress.

- 🧑‍💼 **Staff & Store Management**  
  - Manage multiple staff members.  
  - Assign customers to specific staff.  
  - Upload staff images and display profiles.

- 📊 **Dashboard for Owners**  
  - Manage queue status.  
  - See customer flow metrics.  
  - Customize branding (logos, colors, etc.).

- 📱 **Mobile Optimized**  
  Fully responsive for phones, tablets, and desktops.

- 🔗 **Fully Functional QR Code Generation**  
  QR codes dynamically point to your hosted instance (Netlify or custom domain).

- 🔐 **Secure**  
  Password-protected admin panel and protected customer queues.

---

## 🏗️ Tech Stack

- **Frontend:** React + TailwindCSS  
- **Backend:** Node.js (via Supabase Backend)  
- **Database:** Supabase (PostgreSQL)  
- **Deployment:** Netlify (frontend) & Supabase (backend database and auth)  

---

## 🚀 Live Demo

> Coming Soon… *(or insert your Netlify link)*

---

## 🔧 Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/farhansadat/Queup-Development.git
cd Queup-Development
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Set up Environment Variables

Create a `.env` file in the root folder and add:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### 4️⃣ Run Locally

```bash
npm run dev
```

App runs at `http://localhost:3000`.

---

## 🌐 Deployment

- **Frontend:** Deploy to **Netlify**, **Vercel**, or **GitHub Pages**.  
- **Backend:** Use **Supabase** for authentication, data, and API.

> QR codes dynamically adapt to the deployment domain. When deployed to Netlify, QR links will automatically reflect the Netlify URL.

---

## 🔗 Folder Structure

```
/public       => Static assets (images, QR icons, etc.)
/components   => React components (Navbar, Queue, MonitorDisplay, etc.)
/pages        => Next.js routes
/utils        => QR generation, Supabase client
/styles       => Global styles, Tailwind config
```

---

## 📜 Usage Workflow

### 🧑 For Store Owners:
1. Create an account via the admin panel.
2. Customize your store name, logo, and staff details.
3. Display the QR code for customers to join the queue.
4. Optionally enable Monitor Display mode (via QR or screen).

### 🧍‍♂️ For Customers:
- Scan the **Customer Join QR code**.
- Select the staff (if applicable) and join the queue.
- Receive live updates about position in queue.

---

## 💸 Pricing Model Suggestion (Optional for SaaS):

| Plan        | Price         | Features                                   |
|--------------|---------------|--------------------------------------------|
| Starter      | $10 / month   | QR code queue, 1 monitor, basic dashboard |
| Professional | $50 / month   | Multiple monitors, staff analytics, etc.  |

---

## 📸 Screenshots

| Customer Join | Monitor Display | Admin Panel |
|----------------|-----------------|--------------|
| ![](./public/screenshots/customer.png) | ![](./public/screenshots/monitor.png) | ![](./public/screenshots/admin.png) |

---

## 🚧 Roadmap

- [ ] Add SMS queue updates (via Twilio).
- [ ] Support multi-location businesses.
- [ ] Analytics dashboard with customer insights.
- [ ] Stripe integration for subscription billing.

---

## 🏆 Credits

- Developed by [Farhan Sadat](https://github.com/farhansadat)  
- Powered by **Supabase**, **Netlify**, **React**, and **TailwindCSS**  

---

## 📜 License

MIT License — feel free to use and modify.

---

## ⭐️ Support

If you like this project, consider giving it a ⭐️ on GitHub!  
