# ICET-AIDCDC 2026 Certificate Generator — Complete Project Implementation TODO

## 0. Project Objective

Build a production-ready web application whose primary purpose is to generate certificates from the approved **ICET-AIDCDC 2026** certificate template.

The application must preserve the approved certificate design and allow only the intended recipient-specific information to change.

### Final Product

```text
Certificate Generator Website
        |
        +-- Enter recipient details
        |
        +-- Live certificate preview
        |
        +-- Generate final certificate
        |
        +-- Download PDF
```

### Core architecture decisions

- [x] Use the latest corrected certificate PDF as the fixed template/source of truth.
- [x] Keep the certificate artwork/layout locked.
- [x] Change only approved dynamic text fields.
- [x] Use a frontend-first architecture.
- [x] No database for the initial project.
- [x] No authentication/login.
- [x] No roles.
- [x] No user account system.
- [x] No certificate history/storage.
- [x] No template editor exposed to users.
- [x] No server-side storage.
- [x] Generate the final certificate locally in the browser where technically reliable.
- [x] PDF is the primary output.
- [ ] PNG export can be implemented as an optional secondary output.

---

# Phase 1 — Final Template Lock and Project Specification ✅

## 1.1 Lock the approved template

- [x] Use the latest corrected certificate PDF as the only production template.
- [x] Confirm the date text in the template is corrected to `22nd & 23rd September 2026`.
- [x] Do not reintroduce the previously identified `23nd` typo during implementation.
- [x] Store the approved template under version control.
- [x] Give the production template a stable filename.
- [x] Treat this file as immutable from the normal generator UI.

Suggested asset:

```text
public/templates/ICET-AIDCDC-2026.pdf
```

## 1.2 Confirm fixed certificate content

Keep these parts fixed:

- [x] Government Arts and Science College heading.
- [x] Veerapandi / Theni District / Tamil Nadu / India information.
- [x] Affiliation statement.
- [x] PG Department of Computer Science.
- [x] Asgard branding/logo.
- [x] Conference title and ICET-AIDCDC 2026 branding.
- [x] INNOVATE / INTEGRATE / INSPIRE branding.
- [x] Conference date.
- [x] Certificate heading.
- [x] Fixed conference description.
- [x] Venue.
- [x] Asgard International Foundation for Research & Innovation information.
- [x] IJIDCR publication information.
- [x] Asgard International Research Publications information.
- [x] Signature graphics and fixed designation text.
- [x] Borders.
- [x] Background.
- [x] Decorative illustrations.
- [x] Seals/emblems.
- [x] All other static artwork.

### Fixed-content rule

- [x] Never expose fixed elements as normal user-editable fields.
- [x] Never allow users to move or resize them.
- [x] Never allow users to replace logos or signatures.
- [x] Keep fixed content embedded in the template/background.

---

# Phase 2 — Define Dynamic Certificate Fields ✅

The generator exposes the recipient-specific fields identified in the certificate.
*Update: Per user request and inspection of `sample-needed-output.pdf`, the separate prefix dropdown was removed; users input their full name directly, centered cleanly on the line.*

## 2.1 Prefix

- [x] Evaluated and replaced with direct full-name input per template layout and `sample-needed-output.pdf`.

## 2.2 Recipient name

- [x] Create `recipientName`.
- [x] Make required.
- [x] Define maximum length.
- [x] Handle long names without overflow.

## 2.3 Affiliation

- [x] Create `affiliation`.
- [x] Make required.
- [x] Define maximum length.
- [x] Support long institution/organization names safely.

## 2.4 Paper / presentation title

- [x] Create `paperTitle`.
- [x] Make required.
- [x] Use a multiline textarea.
- [x] Define maximum length.
- [x] Support automatic wrapping.
- [x] Prevent overlap with fixed content below.

Canonical application state:

```js
{
  recipientName: "",
  affiliation: "",
  paperTitle: ""
}
```

---

# Phase 3 — Technical Template Audit ✅

## 3.1 Inspect the final PDF

- [x] Confirm the final PDF contains one page.
- [x] Confirm portrait orientation.
- [x] Determine exact MediaBox dimensions.
- [x] Determine exact page width and height in PDF points.
- [x] Determine whether CropBox matches MediaBox.
- [x] Inspect embedded fonts.
- [x] Inspect embedded images.
- [x] Confirm the corrected date text is present in the actual final source file.
- [x] Confirm there are no unintended form fields.
- [x] Confirm the file loads correctly in the selected PDF libraries.

## 3.2 Resolution and print quality

- [x] Determine effective resolution of raster artwork.
- [x] Perform a physical print test using the approved PDF.
- [x] Evaluate the result at normal viewing/handling distance.
- [x] Keep the source unchanged when its print quality is acceptable.
- [x] Do not upscale the original artwork merely to create more pixels.
- [x] If higher-quality artwork becomes available later, replace the source only after approval and full re-testing.

## 3.3 Coordinate system

- [x] Record exact page dimensions.
- [x] Record MediaBox lower-left coordinates.
- [x] Determine how the chosen PDF library interprets the page origin.
- [x] Verify the Y-coordinate transformation experimentally.
- [x] Create a reusable coordinate-mapping utility.
- [x] Add automated coordinate tests.
- [x] Confirm preview coordinates and PDF coordinates align visually.

---

# Phase 4 — Technology Selection ✅

## 4.1 Frontend

Use:

- [x] React.
- [x] Vite.
- [x] Tailwind CSS.
- [x] JavaScript or TypeScript.

## 4.2 PDF

Evaluate a browser-compatible PDF solution capable of:

- [x] Loading the fixed template.
- [x] Reusing the original PDF page.
- [x] Adding text at exact coordinates.
- [x] Embedding required fonts.
- [x] Saving the final PDF in the browser.
- [x] Preserving the original page size and artwork.

Candidate tools:

- [x] `pdf-lib` for PDF manipulation.
- [x] `pdfjs-dist` or equivalent for browser preview.

Do not finalize the library until the actual certificate template is tested.

## 4.3 Optional PNG

- [ ] Evaluate SVG/canvas-based export.
- [ ] Ensure final resolution is suitable for the intended use.
- [x] Keep PDF as the primary output.

---

# Phase 5 — Project Initialization ✅

- [x] Create the React + Vite application.
- [x] Install/configure Tailwind CSS.
- [x] Install selected PDF dependencies.
- [x] Install testing tools.
- [x] Install linting/formatting tools.
- [x] Initialize Git.
- [x] Add `.gitignore`.
- [x] Create development, production, and test scripts.

Recommended scripts:

```text
npm run dev
npm run build
npm run preview
npm run lint
npm run test
```

- [x] Verify all scripts work.

---

# Phase 6 — Project Structure ✅

Recommended structure:

```text
certificate-generator/
├── public/
│   └── templates/
│       └── ICET-AIDCDC-2026.pdf
│
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── CertificateForm.jsx
│   │   ├── PrefixSelect.jsx
│   │   ├── TextInput.jsx
│   │   ├── TextArea.jsx
│   │   ├── CertificatePreview.jsx
│   │   ├── DownloadActions.jsx
│   │   ├── ValidationMessage.jsx
│   │   └── LoadingState.jsx
│   │
│   ├── config/
│   │   ├── certificateConfig.js
│   │   └── templateConstants.js
│   │
│   ├── services/
│   │   ├── templateLoader.js
│   │   ├── certificateRenderer.js
│   │   ├── pdfGenerator.js
│   │   └── imageGenerator.js
│   │
│   ├── utils/
│   │   ├── coordinateMapper.js
│   │   ├── textFit.js
│   │   ├── textSanitizer.js
│   │   ├── validation.js
│   │   └── fileName.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── tests/
│   ├── coordinateMapper.test.js
│   ├── validation.test.js
│   ├── textFit.test.js
│   └── pdfGeneration.test.js
│
├── package.json
├── vite.config.js
└── README.md
```

- [x] Keep UI components separate from PDF-generation logic.
- [x] Keep field definitions centralized.
- [x] Keep template assets separate.
- [x] Keep text-fitting utilities reusable.

---

# Phase 7 — Certificate Configuration ✅

Create one configuration source for all dynamic fields.

- [x] Add actual template page dimensions.
- [x] Add actual field coordinates.
- [x] Add maximum widths.
- [x] Add preferred font sizes.
- [x] Add minimum font sizes.
- [x] Add line heights.
- [x] Add alignment.
- [x] Add wrapping rules.
- [x] Add maximum line counts.

---

# Phase 8 — Coordinate Mapping and Calibration ✅

For each dynamic field, measure and record:

```text
Field
X position
Y position
Maximum width
Maximum height
Font family
Font size
Font weight
Text color
Alignment
Line height
Maximum lines
```

Fields:

- [x] Recipient name.
- [x] Affiliation.
- [x] Paper title.

## Calibration

- [x] Add temporary coordinate markers during development.
- [x] Render sample text.
- [x] Compare against blank regions in the source certificate.
- [x] Adjust coordinates.
- [x] Verify baseline alignment.
- [x] Verify left/right boundaries.
- [x] Verify vertical spacing.
- [x] Remove calibration controls from production.

## Coordinate utility

```text
Template coordinate
       ↓
Coordinate transformation
       ↓
PDF rendering coordinate
```

- [x] Keep all coordinate math in one utility.
- [x] Do not duplicate coordinate calculations.
- [x] Unit-test the transformation.

---

# Phase 9 — Font Identification and Embedding ✅

## 9.1 Identify fonts

For each dynamic field:

- [x] Determine matching font family.
- [x] Determine weight.
- [x] Determine approximate size.
- [x] Determine text color.
- [x] Check PDF-library support.

## 9.2 Licensing

- [x] Confirm font embedding license.
- [x] Use a visually close open-license font when exact embedding is unavailable.
- [x] Document font and license.
- [x] Add approved font assets where permitted.

## 9.3 Rendering

- [x] Embed selected font in generated PDF where supported.
- [x] Ensure measurement uses the same font used for rendering.
- [x] Verify preview and final PDF typography match.

---

# Phase 10 — Certificate Form UI ✅

Build only the approved input controls:

```text
Certificate Details

Recipient Name
[____________________________]

Affiliation
[____________________________]

Paper / Presentation Title
[____________________________]
[____________________________]

[ Generate PDF ]
[ Reset ]
```

- [x] Add labels.
- [x] Add required indicators.
- [x] Add placeholders where helpful.
- [x] Add character counters for long fields if useful.
- [x] Add reset action.
- [x] Avoid exposing template/layout controls.

---

# Phase 11 — Validation and Sanitization

# Phase 11 — Validation and Sanitization ✅

## Validation

- [x] Recipient name required.
- [x] Affiliation required.
- [x] Paper title required.
- [x] Trim leading/trailing spaces.
- [x] Enforce maximum lengths.
- [x] Handle multiline title rules.
- [x] Handle Unicode safely.

## Sanitization

- [x] Escape SVG/XML-sensitive characters if SVG is used.
- [x] Escape PDF text correctly.
- [x] Prevent user text from becoming executable markup.
- [x] Do not inject raw user input into unsafe HTML.
- [x] Test `<`, `>`, `&`, quotes, apostrophes, and Unicode.

---

# Phase 12 — Live Preview ✅

## Architecture

```text
Fixed certificate background
          +
Dynamic text overlay
          ↓
Live preview
```

- [x] Load the template once.
- [x] Cache the fixed background rendering.
- [x] Overlay dynamic HTML/SVG text.
- [x] Update only dynamic text while typing.
- [x] Do not rebuild the final PDF on every keystroke.
- [x] Preserve exact certificate aspect ratio.
- [x] Keep preview responsive.

## Preview states

- [x] Initial/empty state.
- [x] Partial data state.
- [x] Valid completed state.
- [x] Validation error state.
- [x] PDF generation/loading state.

---

# Phase 13 — Automatic Text Fitting ✅

## Recipient name

- [x] Measure rendered width.
- [x] Use preferred font size if it fits.
- [x] Reduce font size gradually when needed.
- [x] Stop at a minimum readable size.
- [x] Show an error if the name still cannot fit.

## Affiliation

- [x] Measure width.
- [x] Prefer one line.
- [x] Allow controlled wrapping only if the template permits it.
- [x] Reduce font size when necessary.
- [x] Prevent overlap with paper-title content.

## Paper title

- [x] Measure available width/height.
- [x] Wrap long titles.
- [x] Set controlled line height.
- [x] Limit the number of lines.
- [x] Reduce font size when necessary.
- [x] Ensure title stays inside the designated area.
- [x] Show an error when it cannot fit safely.

Test:

- [x] Very short values.
- [x] Medium values.
- [x] Very long values.
- [x] Unicode values.
- [x] Punctuation-heavy values.

---

# Phase 14 — PDF Generation ✅

## Generation flow

```text
Valid certificate data
        ↓
Load cached template
        ↓
Create working copy
        ↓
Embed font(s)
        ↓
Render recipient name
        ↓
Render affiliation
        ↓
Render paper title
        ↓
Save final PDF
        ↓
Download
```

- [x] Use exact coordinate mapping.
- [x] Add only dynamic text.
- [x] Preserve static template content.
- [x] Preserve page dimensions.
- [x] Preserve one-page output.
- [x] Create a fresh working copy per certificate.
- [x] Never overwrite the source template.

---

# Phase 15 — PDF Validation ✅

For every generated PDF:

- [x] Confirm file is created.
- [x] Confirm PDF opens.
- [x] Confirm exactly one page.
- [x] Confirm expected page dimensions.
- [x] Confirm all dynamic fields appear.
- [x] Confirm fixed content remains unchanged.
- [x] Confirm no text clipping.
- [x] Confirm no overlap.
- [x] Confirm font rendering.
- [x] Confirm colors.
- [x] Confirm print suitability.

---

# Phase 16 — Optional PNG Export

Only implement after PDF generation is stable.

- [ ] Render final certificate at high resolution.
- [ ] Preserve aspect ratio.
- [ ] Use controlled export resolution.
- [ ] Do not use a low-resolution browser screenshot as final output.
- [ ] Verify artwork and text sharpness.
- [ ] Add `Download PNG`.

---

# Phase 17 — Download Workflow

Buttons:

- [ ] Generate PDF.
- [ ] Download PDF.
- [ ] Optional Download PNG.
- [ ] Reset.

Generation state:

- [ ] Disable duplicate generation clicks.
- [ ] Show `Generating your certificate...`.
- [ ] Re-enable controls after completion.
- [ ] Show success feedback.
- [ ] Show understandable error feedback.

Filename:

```text
ICET-AIDCDC-2026-Certificate-<RecipientName>.pdf
```

- [ ] Sanitize filename.
- [ ] Remove invalid filesystem characters.
- [ ] Prevent path-like input.
- [ ] Avoid duplicate extensions.

---

# Phase 18 — Reset and Reuse

- [ ] Generate certificate #1.
- [ ] Download certificate #1.
- [ ] Reset.
- [ ] Enter certificate #2.
- [ ] Generate certificate #2.
- [ ] Verify certificate #1 data is not reused.
- [ ] Verify source template is unchanged.
- [ ] Verify repeated generation works without page reload.

---

# Phase 19 — UI/UX and Responsive Design

## Desktop

```text
┌────────────────────────────────────────────────────┐
│       ICET-AIDCDC 2026 Certificate Generator      │
├──────────────────────┬─────────────────────────────┤
│ Certificate Details  │ Certificate Preview         │
│                      │                             │
│ Prefix               │       Certificate           │
│ Recipient Name       │         Preview             │
│ Affiliation          │                             │
│ Paper Title          │                             │
│                      │                             │
│ [Reset]              │ [Generate PDF]             │
└──────────────────────┴─────────────────────────────┘
```

- [ ] Desktop uses a two-column layout.
- [ ] Tablet adapts as needed.
- [ ] Mobile uses a single-column layout.
- [ ] Prevent horizontal overflow.
- [ ] Keep actions easy to access.
- [ ] Keep certificate preview visually prominent.
- [ ] Keep controls simple and focused.

---

# Phase 20 — Accessibility

- [ ] Use semantic HTML.
- [ ] Associate labels with fields.
- [ ] Support keyboard navigation.
- [ ] Provide visible focus states.
- [ ] Use accessible validation messages.
- [ ] Give buttons descriptive names.
- [ ] Ensure the form can be completed without a mouse.

---

# Phase 21 — Security and Privacy

Since the initial application has no database and no authentication:

- [ ] Do not persist certificate data remotely.
- [ ] Do not send recipient information to a server unnecessarily.
- [ ] Do not automatically upload generated certificates.
- [ ] Do not collect unnecessary personal information.
- [ ] Keep the template controlled by the application.
- [ ] Prevent template replacement through normal user inputs.
- [ ] Sanitize dynamic text.
- [ ] Review dependencies before production deployment.
- [ ] Keep dependencies updated.

---

# Phase 22 — Performance

## Template

- [ ] Load the PDF once.
- [ ] Cache template bytes.
- [ ] Avoid repeated parsing.

## Preview

- [ ] Cache fixed background rendering.
- [ ] Update only the text overlay.
- [ ] Avoid PDF regeneration during typing.

## Generation

- [ ] Measure actual generation performance first.
- [ ] Add loading feedback.
- [ ] Test repeated generation.
- [ ] Optimize only when measurements show a need.

## Optional Web Worker

Only introduce a Web Worker if actual devices show noticeable UI blocking.

```text
Main Thread
    |
    | generation request
    v
Web Worker
    |
    | template bytes + certificate data
    v
PDF generation
    |
    v
PDF bytes
    |
    v
Main Thread
    |
    v
Download
```

- [ ] Do not add worker complexity prematurely.
- [ ] Confirm worker output matches normal generation.

---

# Phase 23 — Unit Testing

## Validation

- [ ] Empty prefix fails.
- [ ] Empty name fails.
- [ ] Empty affiliation fails.
- [ ] Empty paper title fails.
- [ ] Maximum lengths enforced.
- [ ] Whitespace handled.
- [ ] Unicode handled.

## Coordinates

- [ ] Page dimensions correct.
- [ ] Coordinate transformation correct.
- [ ] Page-origin behavior tested.
- [ ] Known coordinates produce expected output.

## Text fitting

- [ ] Short name fits.
- [ ] Long name scales.
- [ ] Affiliation fits/wraps.
- [ ] Long title wraps.
- [ ] Overlong values fail safely.

## PDF

- [ ] PDF is generated.
- [ ] PDF opens.
- [ ] Page count is one.
- [ ] Page size matches template.
- [ ] Dynamic text is present.
- [ ] Source template is not mutated.

---

# Phase 24 — Integration Testing

Test:

```text
Enter data
    ↓
Validate
    ↓
Preview
    ↓
Generate
    ↓
Download
```

- [ ] Valid data flow works.
- [ ] Missing data flow fails safely.
- [ ] Long text flow works.
- [ ] Unicode flow works.
- [ ] Repeated generation works.
- [ ] Reset/regenerate works.
- [ ] Download works.

---

# Phase 25 — Certificate Content and Edge-Case Testing

## Prefix

- [ ] Dr.
- [ ] Mr.
- [ ] Ms.

## Names

- [ ] Short name.
- [ ] Medium-length name.
- [ ] Long name.
- [ ] Initials.
- [ ] Hyphenated name.
- [ ] Apostrophe.
- [ ] Unicode.

## Affiliations

- [ ] Short institution.
- [ ] Medium institution.
- [ ] Long institution.
- [ ] Wrapping case.

## Paper titles

- [ ] Short title.
- [ ] Medium title.
- [ ] Long title.
- [ ] Maximum expected title.
- [ ] Punctuation.
- [ ] Numbers.
- [ ] Unicode.

---

# Phase 26 — Visual Regression and Template Integrity

- [ ] Keep approved blank template as a reference.
- [ ] Create a known-good certificate using fixed test data.
- [ ] Compare preview with reference.
- [ ] Compare generated PDF with reference.
- [ ] Verify recipient text positions.
- [ ] Verify dynamic font size.
- [ ] Verify line wrapping.
- [ ] Verify margins.
- [ ] Verify borders.
- [ ] Verify logos.
- [ ] Verify signatures.
- [ ] Verify background.
- [ ] Verify every fixed conference element.
- [ ] Verify the corrected `22nd & 23rd September 2026` content remains intact.

---

# Phase 27 — Browser Compatibility

Test on:

- [ ] Chrome.
- [ ] Firefox.
- [ ] Edge.
- [ ] Safari where applicable.

Verify:

- [ ] Form.
- [ ] Preview.
- [ ] Fonts.
- [ ] PDF generation.
- [ ] Downloads.
- [ ] PNG if enabled.
- [ ] Responsive behavior.
- [ ] Unicode handling.

---

# Phase 28 — Real Device Testing

Test on:

- [ ] Desktop/laptop.
- [ ] Low/mid-range Android phone.
- [ ] iPhone/iOS device if available.

Measure:

- [ ] Initial load.
- [ ] Template load.
- [ ] Preview responsiveness.
- [ ] PDF generation time.
- [ ] Download reliability.
- [ ] Repeated generation behavior.

Acceptance:

- [ ] Form remains responsive.
- [ ] Preview has no noticeable typing lag.
- [ ] Generation shows clear progress state.
- [ ] Download is reliable.

---

# Phase 29 — Print Quality Testing

Mandatory before production.

- [ ] Download final PDF.
- [ ] Open at 100% zoom.
- [ ] Inspect at 200% zoom.
- [ ] Print at actual size.
- [ ] Verify intended paper size.
- [ ] Verify orientation.
- [ ] Verify margins.
- [ ] Verify borders.
- [ ] Verify logo quality.
- [ ] Verify signature quality.
- [ ] Verify dynamic text sharpness.
- [ ] Verify text placement.
- [ ] Verify no clipping.
- [ ] Verify no unexpected scaling.
- [ ] Verify the corrected `22nd & 23rd September 2026` text remains correct.

---

# Phase 30 — Error Handling

Handle:

- [ ] Missing template.
- [ ] Template loading failure.
- [ ] Unsupported PDF feature.
- [ ] Font loading failure.
- [ ] PDF generation failure.
- [ ] PNG generation failure.
- [ ] Text overflow.
- [ ] Invalid input.
- [ ] Download failure.
- [ ] Unexpected runtime errors.

Example:

```text
Unable to generate the certificate.
Please check the entered information and try again.
```

- [ ] Never expose internal stack traces to users.

---

# Phase 31 — Production UI Polish

- [ ] Add professional application title.
- [ ] Ensure clean form spacing.
- [ ] Ensure preview is prominent.
- [ ] Use consistent buttons.
- [ ] Add loading state.
- [ ] Add success state.
- [ ] Add error state.
- [ ] Add reset action.
- [ ] Remove unnecessary controls.
- [ ] Keep the interface focused on certificate generation.

---

# Phase 32 — Production Build

- [ ] Run lint.
- [ ] Run all tests.
- [ ] Run production build.
- [ ] Test production build locally.
- [ ] Verify template asset paths.
- [ ] Verify font assets.
- [ ] Verify PDF generation.
- [ ] Verify downloads.
- [ ] Remove development/debug controls.
- [ ] Remove coordinate calibration UI.
- [ ] Remove debug logs.
- [ ] Check production browser console.

---

# Phase 33 — Deployment

Because there is no database, authentication, roles, or storage, use static hosting when browser-side PDF generation is confirmed reliable.

Possible hosting:

- [ ] Vercel.
- [ ] Netlify.
- [ ] Cloudflare Pages.

Deployment checklist:

- [ ] Connect Git repository.
- [ ] Configure build command.
- [ ] Configure output directory.
- [ ] Deploy production build.
- [ ] Test production URL.
- [ ] Generate test certificate.
- [ ] Download PDF.
- [ ] Open PDF.
- [ ] Print PDF.
- [ ] Test another browser/device.

---

# Phase 34 — Domain and Production Configuration

- [ ] Connect custom domain if required.
- [ ] Enable HTTPS.
- [ ] Add favicon.
- [ ] Configure page title.
- [ ] Configure metadata.
- [ ] Add basic privacy information when appropriate.
- [ ] Verify no unnecessary external APIs are required.
- [ ] Confirm application works without a backend.

---

# Phase 35 — Documentation

## README

Document:

- [ ] Project purpose.
- [ ] Technology stack.
- [ ] Installation.
- [ ] Development command.
- [ ] Production build.
- [ ] Deployment.
- [ ] Template location.
- [ ] Dynamic fields.
- [ ] Coordinate system.
- [ ] Font requirements.
- [ ] PDF generation approach.

## Template maintenance

Document:

- [ ] How to replace the certificate template safely.
- [ ] How to measure new coordinates.
- [ ] How to update fonts.
- [ ] How to test template changes.
- [ ] How to run visual tests.
- [ ] How to verify print quality.

---

# Phase 36 — Final Acceptance Checklist

## Functionality

- [ ] User can open the site.
- [ ] User can select prefix.
- [ ] User can enter recipient name.
- [ ] User can enter affiliation.
- [ ] User can enter paper title.
- [ ] Validation works.
- [ ] Live preview works.
- [ ] Dynamic text is correctly positioned.
- [ ] Text fitting works.
- [ ] PDF generation works.
- [ ] PDF downloads.
- [ ] PNG downloads if enabled.
- [ ] Reset works.
- [ ] Multiple certificates can be generated in one session.

## Template integrity

- [ ] Approved design is preserved.
- [ ] Logos are unchanged.
- [ ] Borders are unchanged.
- [ ] Decorative artwork is unchanged.
- [ ] Signatures are unchanged.
- [ ] Fixed conference information is unchanged.
- [ ] Correct `22nd & 23rd September 2026` text remains present.
- [ ] No unintended fixed-text changes occur.

## Architecture

- [ ] React + Vite used.
- [ ] No database.
- [ ] No authentication.
- [ ] No roles.
- [ ] No user accounts.
- [ ] No remote certificate storage.
- [ ] No unnecessary backend.
- [ ] No template editor.
- [ ] Template remains controlled by the application.

## Quality

- [ ] No text clipping.
- [ ] No text overlap.
- [ ] No template distortion.
- [ ] No incorrect scaling.
- [ ] No broken downloads.
- [ ] No production console errors.
- [ ] Responsive UI works.
- [ ] Printed certificate is acceptable.

---

# Phase 37 — Future Enhancements (Not MVP)

Implement only if requirements change:

- [ ] Multiple certificate templates.
- [ ] Template selection.
- [ ] Admin-only template management.
- [ ] Authentication.
- [ ] Role-based permissions.
- [ ] Database-backed certificate records.
- [ ] Certificate history.
- [ ] Certificate verification page.
- [ ] QR code verification.
- [ ] Bulk certificate generation.
- [ ] CSV import.
- [ ] Automated email delivery.
- [ ] Cloud certificate storage.
- [ ] Certificate revocation.
- [ ] Certificate expiry.
- [ ] Audit logs.
- [ ] Analytics.
- [ ] Server-side generation fallback if browser generation proves unsuitable.

---

# Final Recommended Development Sequence

```text
Phase 1  → Final Template Lock
Phase 2  → Dynamic Field Definition
Phase 3  → Technical Template Audit
Phase 4  → Technology Selection
Phase 5  → Project Initialization
Phase 6  → Project Architecture
Phase 7  → Certificate Configuration
Phase 8  → Coordinate Mapping
Phase 9  → Font Identification
Phase 10 → Form UI
Phase 11 → Validation & Sanitization
Phase 12 → Live Preview
Phase 13 → Automatic Text Fitting
Phase 14 → PDF Generation
Phase 15 → PDF Validation
Phase 16 → Optional PNG Generation
Phase 17 → Download Workflow
Phase 18 → Reset & Reuse
Phase 19 → UI/UX
Phase 20 → Accessibility
Phase 21 → Security & Privacy
Phase 22 → Performance
Phase 23 → Unit Testing
Phase 24 → Integration Testing
Phase 25 → Content & Edge-Case Testing
Phase 26 → Visual Regression
Phase 27 → Browser Compatibility
Phase 28 → Real Device Testing
Phase 29 → Print Quality
Phase 30 → Error Handling
Phase 31 → Production UI Polish
Phase 32 → Production Build
Phase 33 → Deployment
Phase 34 → Domain/Production Configuration
Phase 35 → Documentation
Phase 36 → Final Acceptance
Phase 37 → Future Enhancements
```

# Definition of Done

The project is complete when an operator can:

```text
Open Certificate Generator
        ↓
Select Prefix
        ↓
Enter Recipient Name
        ↓
Enter Affiliation
        ↓
Enter Paper / Presentation Title
        ↓
Validate Input
        ↓
View Live Certificate
        ↓
Generate Final PDF
        ↓
Download Certificate
        ↓
Print Certificate
```

The final output must satisfy:

```text
Approved Fixed Template
          +
Approved Dynamic Fields
          +
Accurate Text Positioning
          +
Correct Text Fitting
          +
High-Quality PDF
          =
Production Certificate Generator
```

## MVP Architectural Rules

```text
NO DATABASE
NO LOGIN
NO ROLES
NO USER ACCOUNTS
NO CERTIFICATE HISTORY
NO TEMPLATE EDITOR
NO SERVER STORAGE

FRONTEND-FIRST
FIXED PDF TEMPLATE
DYNAMIC TEXT OVERLAY
PDF AS PRIMARY OUTPUT
```
