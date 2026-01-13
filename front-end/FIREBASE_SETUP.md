# Firebase Authentication Setup Guide

You are encountering the error: `auth/operation-not-allowed`.
This means the **"Email/Password"** sign-in method is disabled in your Firebase project.

## 🚨 IMMEDIATE ACTION REQUIRED

1. Open your [Firebase Console](https://console.firebase.google.com/).
2. Select your project: **`alcohol-ordering-system`**.
3. In the left sidebar, click **Build** -> **Authentication**.
4. Click the **Sign-in method** tab.
5. Click on the **Email/Password** row.
6. Toggle the **Enable** switch to **ON**.
7. Click **Save**.

## 👤 Creating Your User

After enabling the provider:
1. Go to the **Users** tab (next to "Sign-in method").
2. Click **Add user**.
3. **Email**: `rsdg2004@gmail.com`
4. **Password**: (Choose a secure password)
5. Click **Add user**.

## ✅ Try Logging In Again
Go back to your application login page:
- **Email**: `rsdg2004@gmail.com`
- **Password**: (The one you just created)

You should now be able to log in successfully and be redirected to the Admin Dashboard.
