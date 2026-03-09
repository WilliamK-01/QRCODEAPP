# QR Code Business Card App — Project Brief

You are building a modern web application that allows users to create and share digital business cards via QR codes.

The application should prioritize:

- simplicity
- mobile usability
- fast loading
- easy sharing
- minimal infrastructure costs

The goal is to replace traditional business cards with a single QR code that always stays up to date.

---

## 1. Project Overview

Build a mobile-first web app where users can:

- Create a digital business card
- Generate a QR code linked to their card
- Share that QR code with others
- Allow anyone who scans the QR code to instantly view the card in a browser

No app installation should be required for the person scanning the QR code.

---

## 2. Technology Stack

Use the following stack:

**Frontend:**
- React
- Next.js
- TailwindCSS
- QRCode library

**Backend:**
- Node.js
- Next.js API routes

**Database:**
- SQLite for development
- Easily upgradeable to PostgreSQL

**Authentication:**
- Email login
- Google OAuth optional

**Deployment:**
Must be deployable on:
- Vercel
- Netlify
- Docker

---

## 3. Core Features (MVP)

### 3.1 User Accounts

Users must be able to:
- Create an account
- Log in
- Log out
- Edit profile
- Delete account

Authentication should support:
- email/password
- optional Google login

### 3.2 Digital Business Card

Users should be able to create and edit a digital card with:

**Fields:**
- Full name
- Job title
- Company name
- Phone number
- Email
- Website
- Physical address (optional)
- Profile photo or logo
- Short bio/tagline

Cards should be editable at any time.
When the user updates their information, the card updates without changing the QR code.

### 3.3 QR Code Generation

Each card automatically generates a unique QR code.

The QR code should link to: `/card/{uniqueID}`

**Capabilities:**
- display QR full screen
- download QR image
- share QR image
- embed QR in email signature

### 3.4 Public Card Page

When someone scans the QR code, they see a mobile optimized card page.

The page should display:
- Profile photo
- Name
- Title
- Company
- Contact details

**Interactive buttons:**
- Call
- Email
- Open website
- Open map location
- Save contact

### 3.5 Contact Saving (vCard)

Include a **Download Contact** button that downloads a `.vcf` file.
This allows the scanner to save the contact directly into their phone.

---

## 4. Card Editing System

Users must be able to:
- Edit card details
- Upload profile photo
- Update links
- Preview card

Changes should update instantly without generating a new QR code.

---

## 5. UI/UX Requirements

The interface must be:
- Mobile-first
- Clean and minimal
- Easy to use for non-technical users

**Pages required:**
- Home page
- Login page
- Register page
- Dashboard
- Edit card page
- QR code page
- Public card page

Use TailwindCSS to style the UI.

---

## 6. Database Structure

**Users table:**
- id
- email
- password_hash
- created_at

**Cards table:**
- id
- user_id
- name
- title
- company
- phone
- email
- website
- address
- bio
- profile_image
- created_at
- updated_at

---

## 7. Security

Implement:
- password hashing
- basic rate limiting
- validation of user inputs
- protection against XSS

Users should only be able to edit their own cards.

---

## 8. Performance Requirements

The application should:
- load quickly on mobile networks
- minimize image size
- cache static assets

QR scan → card display should take less than 2 seconds.

---

## 9. Future Expansion (Phase 2)

Design architecture so it can later support:
- Multiple cards per user
- Analytics (scan count)
- Custom card themes
- Social media links
- Team/company accounts

---

## 10. Value Proposition

The app replaces printed business cards with:

> "One QR code that always stays up to date."

Users never need to reprint cards again.

---

## 11. Development Goals

Code should be:
- Clean
- Modular
- Easy to maintain
- Easy to expand

Use modern best practices for React and Next.js.

---

## 12. Deliverables

- Full project folder structure
- Database schema
- React components
- API routes
- QR code generator
- Public card page
- vCard download feature
