# QR Business Card

A digital business card application built with Next.js. Create your card, generate a QR code, and share it — the QR code stays the same even when you update your info.

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **TailwindCSS**
- **Prisma 5** with SQLite
- **NextAuth.js** (email/password)
- **qrcode** library for QR generation
- **bcryptjs** for password hashing

## Features

- User registration & login
- Create and edit your digital business card
- QR code generation (download as PNG, share, copy link)
- Public card page with contact action links
- vCard (.vcf) download for easy contact saving

## Getting Started

```bash
npm install
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
