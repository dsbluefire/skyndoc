# Waitlist Backend Setup Guide

## Quick Setup with Supabase (5 minutes)

### Step 1: Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email
4. Create a new project:
   - Name: `skyndoc-waitlist`
   - Database Password: (choose a strong password, save it)
   - Region: Choose closest to your users (e.g., US East)
   - Pricing Plan: Free (perfect for waitlists)

### Step 2: Create Database Table

1. In your Supabase dashboard, go to **Table Editor** (left sidebar)
2. Click **"New table"**
3. Use these settings:
   - **Table name**: `waitlist_signups`
   - **Enable Row Level Security (RLS)**: OFF (for now, we'll enable it)
   
4. Add these columns:

| Column Name | Type | Default Value | Extra Settings |
|------------|------|---------------|----------------|
| id | uuid | uuid_generate_v4() | Primary, Auto-increment |
| created_at | timestamptz | now() | - |
| phone_number | text | - | Required |
| box_type | text | - | Required |
| formatted_phone | text | - | Optional |
| country_code | text | '+1' | Optional |

5. Click **"Save"**

### Step 3: Set Up Row Level Security (RLS)

1. Still in Table Editor, click on your `waitlist_signups` table
2. Click the **"RLS"** tab
3. Click **"New Policy"**
4. Create an "Insert" policy:
   - Policy name: `Allow public inserts`
   - Policy command: `INSERT`
   - Target roles: `public`
   - USING expression: `true`
   - Click **"Save"**

This allows anyone to submit to your waitlist but not read others' data.

### Step 4: Get Your API Credentials

1. Go to **Project Settings** (gear icon in left sidebar)
2. Click **API** in the left menu
3. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Project API keys** → **anon/public** key (starts with `eyJ...`)

### Step 5: Add to Your Project

Add to your `.env` file:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Restart your dev server** after adding these!

### Step 6: View Your Waitlist Data

1. Go to **Table Editor** in Supabase
2. Click on `waitlist_signups` table
3. You'll see all submissions with:
   - Phone numbers
   - Which box they signed up for
   - Timestamp
   - Can export to CSV

---

## Alternative: Airtable (Easier but Less Scalable)

If you want something even simpler:

1. Create free Airtable account at [airtable.com](https://airtable.com)
2. Create a new base called "Skyndoc Waitlist"
3. Create a table with columns:
   - Phone Number (Phone)
   - Box Type (Single select: General, Explore, Glow, Custom)
   - Submitted At (Created time)
4. Get API key from Account settings
5. Use Airtable API to submit forms

---

## Alternative: Google Sheets (Simplest for MVP)

If you just need something quick:

1. Create a Google Sheet
2. Use Google Sheets API or a service like [Sheet.best](https://sheet.best)
3. Submit form data directly to the sheet
4. View in real-time in Google Sheets

**Recommendation**: Use Supabase - it's free, scalable, and gives you a real database for when you grow.

