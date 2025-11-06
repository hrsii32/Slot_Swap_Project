# Slot Swap Application

A collaborative web-based platform that enables users to **swap time-based slots with others** in an organized and automated manner.  
Designed for colleges, workspaces, lab scheduling, exam monitoring duties, classroom reservations, and more.

---

## 🔥 Key Highlights

- ✅ User Authentication & Authorization
- 📅 Manage Personal Slots
- 🔄 Publish / Request / Approve Slot Swaps
- 🛒 Marketplace View for Available Slots
- 🔔 Notifications for Swap Requests
- 💾 Persistent Data Storage with MySQL
- 🎨 Responsive & Clean Angular UI

---

## 🏗️ Tech Stack

| Component     | Technology Used         |
|---------------|------------------------|
| Frontend UI   | Angular                 |
| Backend API   | Spring Boot (Java)      |
| Security      | Spring Security + JWT   |
| Database      | MySQL                   |
| ORM           | JPA / Hibernate         |
| Build Tools   | Maven / npm             |

---

## 📌 System Architecture

┌──────────────┐ REST API ┌──────────────┐ JDBC ┌──────────────┐
│ Angular │ <----------------> │ Spring Boot │ <------------> │ MySQL │
└──────────────┘ └──────────────┘ └──────────────┘