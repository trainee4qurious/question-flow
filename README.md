# Question Flow

A dynamic, multi-step question flow application built with Next.js, featuring a Google Sheets backend via Google Apps Script.

## 🚀 Tech Stack

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Form Handling:** [React Hook Form](https://react-hook-form.com/)
- **Validation:** [Zod](https://zod.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Backend:** Google Sheets + Google Apps Script

## 📁 Project Structure

```text
src/
├── app/            # Next.js App Router pages and layouts
├── components/     # Reusable UI components (Form fields, Navigation, etc.)
├── hooks/          # Custom React hooks
├── lib/            # API utilities and shared logic
├── store/          # Zustand store for state management
├── types/          # TypeScript definitions
└── validations/    # Zod schemas for form validation
```

## 🛠️ Setup & Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd question-flow
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add your Google Apps Script Web App URL:

```env
NEXT_PUBLIC_APPS_SCRIPT_URL='your_deployment_url_here'
```

## 📊 Google Apps Script Backend

This project uses a Google Sheet as a database. Follow these steps to set it up:

1. Create a new Google Sheet.
2. Create two tabs: `Questions` and `Answers`.
3. In the `Questions` tab, add these headers: `ID`, `Step`, `Question`, `Description`, `QuestionType`, `Options`, `Required`, `Placeholder`, `MinLength`, `MaxLength`, `Order`, `Active`.

#### Configuration Details:
- **Supported `QuestionType`:** `checkbox`, `dropdown`, `email`, `text`, `textarea`, `radio`.
- **`Required` & `Active` columns:** Use `TRUE` or `FALSE` (Boolean).
- **`Order` column:** Defines the sorting sequence of questions within a step and the column order in the `Answers` sheet. Use integers (1, 2, 3...).
- **`Options` column:** Use a structured JSON array:

    - **Standard:** `[{"label":"Home","value":"home"},{"label":"Office","value":"office"}]`
    - **With Points:** `[{"label":"Home","value":"home","points": 10},{"label":"Office","value":"office","points": 0}]`
    - **With Images:** `[{"label":"success","image":"https://example.com/image.jpg"},{"label":"failure","image":"https://example.com/image.jpg"}]`

#### 🏆 Point System & Scoring
- **Configuration:** Points are assigned per option within the `Options` JSON array using the `"points"` key.
- **Calculation:** The total score is the sum of points from all selected/answered questions in the flow.
- **Redirection:** 
  - **Success Page:** Triggered if `Total Score >= 50`.
  - **Failure Page:** Triggered if `Total Score < 50`.
- **Data Storage:** The calculated `Total Score` is automatically appended as the last column for each submission in the `Answers` sheet.

4. Go to **Extensions > Apps Script**.
5. Paste the following code into the script editor:

```javascript
const SHEET_QUESTIONS = "Questions"
const SHEET_ANSWERS = "Answers"

/**
 * Handle GET requests
 */
function doGet(e) {
    const action = e.parameter.action
    if (action === 'questions' || !action) {
        return getQuestions()
    }
    return createJsonResponse({ error: 'Invalid action' }, 400)
}

/**
 * Handle POST requests
 */
function doPost(e) {
    try {
        const payload = JSON.parse(e.postData.contents)
        const { submissionId, data } = payload

        if (!data) {
            return createJsonResponse({ success: false, error: 'Missing submission data' })
        }

        const ss = SpreadsheetApp.getActiveSpreadsheet()
        const aSheet = ss.getSheetByName(SHEET_ANSWERS)
        if (!aSheet) throw new Error('Answers sheet not found')

        // Append the flat data array sent from the frontend
        aSheet.appendRow(data)

        return createJsonResponse({ success: true, submissionId })
    } catch (err) {
        return createJsonResponse({ success: false, error: err.toString() })
    }
}

/**
 * Fetch and format questions from the sheet
 */
function getQuestions() {
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    const sheet = ss.getSheetByName(SHEET_QUESTIONS)
    if (!sheet) return createJsonResponse({ error: 'Questions sheet not found' }, 404)

    const data = sheet.getDataRange().getValues()
    const headers = data[0].map(h => h.toString().trim())
    const rows = data.slice(1)

    const questions = rows.map(row => {
        const q = {}
        headers.forEach((header, index) => {
            let value = row[index]
            const lowerHeader = header.toLowerCase()

            if (lowerHeader === 'options' && value) {
                try {
                    q[lowerHeader] = JSON.parse(value)
                } catch (e) {
                    q[lowerHeader] = value.toString().split(',').map(opt => ({
                        label: opt.trim(),
                        value: opt.trim()
                    }))
                }
            } else {
                q[lowerHeader] = value
            }
        })
        return q
    }).filter(q => {
        const active = q.active !== undefined ? q.active : q.Active
        return String(active).toLowerCase() === 'true' || active === true
    })

    return createJsonResponse(questions)
}

function createJsonResponse(data, status = 200) {
    return ContentService.createTextOutput(JSON.stringify(data))
        .setMimeType(ContentService.MimeType.JSON)
}
```

6. Click **Deploy > New Deployment**.
7. Select type **Web App**.
8. Set **Execute as:** `Me` and **Who has access:** `Anyone`.
9. Copy the **Web App URL** and paste it into your `.env.local`.

## 💻 Local Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
