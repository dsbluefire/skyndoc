# Quick Start: Waitlist Backend

## Step 1: Install Supabase Package

Run this command in your terminal:

```bash
npm install @supabase/supabase-js
```

## Step 2: Set Up Supabase (5 minutes)

### 2.1: Create Account
1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project called "skyndoc-waitlist"
3. Choose a database password and save it
4. Select region closest to you (e.g., US East)

### 2.2: Create Database Table
1. In Supabase dashboard, go to **Table Editor** (left sidebar)
2. Click **"New table"**
3. **Table name**: `waitlist_signups`
4. **Turn OFF** "Enable Row Level Security" for now
5. Add these columns (click "Add column" for each):

**Column 1:**
- Name: `id`
- Type: `uuid`
- Default value: `uuid_generate_v4()`
- ✅ Check "Is Primary Key"

**Column 2:**
- Name: `created_at`
- Type: `timestamptz`
- Default value: `now()`

**Column 3:**
- Name: `phone_number`
- Type: `text`
- ✅ Check "Is Nullable" (uncheck it)

**Column 4:**
- Name: `box_type`
- Type: `text`
- ✅ Check "Is Nullable" (uncheck it)

**Column 5:**
- Name: `formatted_phone`
- Type: `text`

**Column 6:**
- Name: `country_code`
- Type: `text`
- Default value: `'+1'`

6. Click **"Save"**

### 2.3: Enable Row Level Security
1. Click on your `waitlist_signups` table
2. Click **"RLS disabled"** button to enable it
3. Click **"New Policy"**
4. Select **"For full customization"**
5. **Policy name**: `Allow public inserts`
6. **Policy command**: SELECT `INSERT` from dropdown
7. **Target roles**: Leave as `public`
8. **WITH CHECK expression**: Type `true`
9. Click **"Save policy"**

### 2.4: Get Your API Keys
1. Go to **Project Settings** (gear icon, bottom left)
2. Click **API** in left menu
3. Copy these values:
   - **Project URL** (e.g., `https://abcdefgh.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## Step 3: Add to Your Project

Add these lines to your `.env` file (create it if it doesn't exist):

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-long-key-here
```

**IMPORTANT**: Restart your dev server after adding these!

```bash
# Stop server (Ctrl+C)
# Then restart:
npm run dev
```

## Step 4: Test It!

1. Go to your waitlist page: `http://localhost:8080/waitlist`
2. Enter a phone number and submit
3. Check your Supabase dashboard → Table Editor → `waitlist_signups`
4. You should see your entry! 🎉

## Viewing Your Waitlist Data

### In Supabase Dashboard:
1. Go to **Table Editor**
2. Click on `waitlist_signups` table
3. See all submissions sorted by date
4. Filter by `box_type` to see which box they want
5. Export to CSV anytime

### What Gets Saved:
- **phone_number**: The phone number entered
- **box_type**: Which page they submitted from
  - `general` - Main waitlist page
  - `explore` - Explore Box ($14.99)
  - `glow` - Glow Box ($19.99)
  - `custom` - Custom Box ($24.99)
- **created_at**: Timestamp of submission
- **formatted_phone**: Formatted version of number
- **country_code**: Country code (+1 for US)

## Troubleshooting

**Forms not submitting?**
- Check browser console (F12) for errors
- Make sure you restarted dev server after adding .env
- Verify Supabase credentials are correct

**"Supabase not configured" in console?**
- Check .env file exists in project root
- Variables start with `VITE_` prefix
- Restart dev server

**Need help?**
- Check `WAITLIST_SETUP.md` for detailed instructions
- Supabase docs: [supabase.com/docs](https://supabase.com/docs)

## Alternative: Development Mode

If you haven't set up Supabase yet, the waitlist will still work in "dev mode":
- Forms will submit successfully
- Data is logged to browser console
- No actual database storage
- Perfect for testing the UX

Once you're ready for real signups, just follow steps above!

