# Vellora Health prototype interactions

[Open the Figma Design file](https://www.figma.com/design/WjeTBD8esH0aNX0Joe8y4t) · [Play the Public Website flow](https://www.figma.com/proto/WjeTBD8esH0aNX0Joe8y4t/Vellora-Health-%E2%80%94-Complete-UI-UX-Design-System---Interactive-Prototype?node-id=1-2&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=1%3A2)

## Figma verification

| Action | Destination | Evidence |
| --- | --- | --- |
| Start Public Website | Homepage | Opened in Present mode from the 1440 × 960 starting frame. Vertical overflow is set to Vertical. |
| Click Sign in in the homepage header | Patient sign-in | Observed the destination in Present mode. This demo opens the dedicated sign-in screen. The running homepage uses an auth modal. |
| Click the brand logo in patient sign-in | Homepage | Observed the return to the starting frame in Present mode. |
| Hover over a Default verification button instance | Hover variant | While hovering → Change to Hover is configured and inspected in the editor. Presentation playback of an instance remains to be checked. |

The [verification button set](https://www.figma.com/design/WjeTBD8esH0aNX0Joe8y4t?node-id=123-11) has Default and Hover variants. The captured login form still has its original editable button layer.

## Running application checks

The local browser used a fresh session and repository-provided mock accounts. Seven web journeys and the updated Expo catalog journey passed.

| Journey | Observed behavior |
| --- | --- |
| Public navigation | Header Services opened the catalog. The facilities alias ended at Services. |
| Booking overlay | The homepage booking CTA opened the dialog. Escape dismissed it. |
| Callback | The required fields and consent accepted a synthetic request. Acknowledgement and return controls appeared. |
| Patient access | The guest gate appeared. Invalid code showed feedback. Valid demo OTP opened the dashboard. The bookings list led to a seeded visit detail. |
| Patient booking | The service selection progressed through patient and address, schedule, review, and local confirmation. |
| Provider workspace | A seeded clinician reached their appointment list and availability. |
| Administration | A seeded admin reached Appointments, Doctors, and the provider credential queue. |
| Expo service catalog | Book a Service on mobile Home opened the catalog. Tests filtered the list, and Home Lab Tests opened the matching detail. |

## Remaining native connections

Figma’s Starter-plan MCP quota stopped programmatic native editing. The screenshots and directly linked design frames below supply a handoff for the rest of the connections. A click-through with simulated selections can demonstrate the same sequence as the browser.

| Area | Starting frame or state | Controls and destinations to wire |
| --- | --- | --- |
| Public navigation | [home](https://www.figma.com/design/WjeTBD8esH0aNX0Joe8y4t?node-id=1-2) | Header Services, Doctors, About, and Contact → their like-named frames. Public logo → Home. Doctor cards → matching doctor booking example. Service category cards → corresponding category. |
| Appointment overlay | [home](https://www.figma.com/design/WjeTBD8esH0aNX0Joe8y4t?node-id=1-2) | Book Appointment → [booking overlay](https://www.figma.com/design/WjeTBD8esH0aNX0Joe8y4t?node-id=120-2). The close button returns to Home. A full-page replica can use Navigate to and Back. To use Open overlay, isolate the dialog layers in a top-level overlay frame first. |
| Callback | [book](https://www.figma.com/design/WjeTBD8esH0aNX0Joe8y4t?node-id=76-2) | Request a Callback → [request success](https://www.figma.com/design/WjeTBD8esH0aNX0Joe8y4t?node-id=115-2). Route the acknowledgement’s home link to Home. Keep the in-form selection and consent states visible for demo progression. |
| Verification | [patient login](https://www.figma.com/design/WjeTBD8esH0aNX0Joe8y4t?node-id=2-2) | Send Verification Code → [patient otp](https://www.figma.com/design/WjeTBD8esH0aNX0Joe8y4t?node-id=116-2). Add a demo path to [patient otp invalid](https://www.figma.com/design/WjeTBD8esH0aNX0Joe8y4t?node-id=117-2) and a successful path to [patient dashboard](https://www.figma.com/design/WjeTBD8esH0aNX0Joe8y4t?node-id=70-2). Create an Account → [patient register](https://www.figma.com/design/WjeTBD8esH0aNX0Joe8y4t?node-id=63-2). |
| Patient booking | patient book | Proceed to Patient Details → [patient book step 2](https://www.figma.com/design/WjeTBD8esH0aNX0Joe8y4t?node-id=118-2) → Scheduling → [patient book step 3](https://www.figma.com/design/WjeTBD8esH0aNX0Joe8y4t?node-id=119-2) → Review & Payment → [patient book step 4](https://www.figma.com/design/WjeTBD8esH0aNX0Joe8y4t?node-id=121-2) → Confirm & Book → [patient book confirmed](https://www.figma.com/design/WjeTBD8esH0aNX0Joe8y4t?node-id=122-2). Connect Back between steps. |
| Bookings and account | [patient dashboard](https://www.figma.com/design/WjeTBD8esH0aNX0Joe8y4t?node-id=70-2) | View All Bookings → [patient bookings](https://www.figma.com/design/WjeTBD8esH0aNX0Joe8y4t?node-id=69-2). View Details & Track → [patient bookings bkg 101](https://www.figma.com/design/WjeTBD8esH0aNX0Joe8y4t?node-id=72-2). Account → [patient account](https://www.figma.com/design/WjeTBD8esH0aNX0Joe8y4t?node-id=73-2). Records → [patient records](https://www.figma.com/design/WjeTBD8esH0aNX0Joe8y4t?node-id=65-2) → [patient records lab 1](https://www.figma.com/design/WjeTBD8esH0aNX0Joe8y4t?node-id=66-2). |
| Provider entry | [join as provider](https://www.figma.com/design/WjeTBD8esH0aNX0Joe8y4t?node-id=74-2) | Apply → [provider register](https://www.figma.com/design/WjeTBD8esH0aNX0Joe8y4t?node-id=48-2) → [provider onboarding](https://www.figma.com/design/WjeTBD8esH0aNX0Joe8y4t?node-id=56-2) → [provider application status](https://www.figma.com/design/WjeTBD8esH0aNX0Joe8y4t?node-id=62-2). Remaining form-stage variants should come from the corresponding source states. |
| Provider workspace | [provider dashboard](https://www.figma.com/design/WjeTBD8esH0aNX0Joe8y4t?node-id=59-2) | Appointments → [provider appointments](https://www.figma.com/design/WjeTBD8esH0aNX0Joe8y4t?node-id=60-2) → [provider appointments bkg 101](https://www.figma.com/design/WjeTBD8esH0aNX0Joe8y4t?node-id=61-2). Connect Requests, Availability, Clinical Records, Earnings, and Profile using the portal navigation. |
| Admin workspace | [admin dashboard](https://www.figma.com/design/WjeTBD8esH0aNX0Joe8y4t?node-id=90-2) | Sidebar → each named administration route in the inventory. Doctors → [admin providers](https://www.figma.com/design/WjeTBD8esH0aNX0Joe8y4t?node-id=82-2) → [admin providers applications](https://www.figma.com/design/WjeTBD8esH0aNX0Joe8y4t?node-id=83-2). |
| Mobile | Mobile web Home and [Expo Welcome](https://www.figma.com/design/WjeTBD8esH0aNX0Joe8y4t?node-id=101-2) | Create separate responsive web and Expo flows. Connect Expo Welcome → Login → OTP → setup → [Home](https://www.figma.com/design/WjeTBD8esH0aNX0Joe8y4t?node-id=125-2), then Book a Service → [Services](https://www.figma.com/design/WjeTBD8esH0aNX0Joe8y4t?node-id=124-2). Connect the four tabs and the doctor visit request. |

## Manual Figma steps

1. Open the linked frame. For a tall screen, keep the full capture as a child of a 1440 × 960 desktop frame or a 390 × 844 mobile frame. Enable Clip content, then set Prototype → Scroll behavior → Overflow → Vertical on the viewport. Use Fixed position in Prototype for persistent headers or tabs if appropriate.
2. Select the actual editable button or navigation layer. In Prototype, drag its connector to the corresponding top-level destination or choose Interactions → Add → On click → Navigate to. Match the target using the inventory links before assigning it.
3. For dialogs, use On click → Open overlay with the isolated dialog frame centered. Add On click → Close overlay to the close control. Turn on outside-click dismiss where the source supports it.
4. For validation, provide a clear demo branch to an invalid state and a second branch to the valid state. An interactive component can use Change to for visual state. Represent backend and OTP outcomes with named demo frames.
5. Set a flow starting point for each journey. In Present mode, test the expected destination, Back and modal close, overflow at the intended viewport, and routes back to each start. Verify across selected widths. Figma reported missing fonts on this file, so compare the reviewed type with the application before presenting.

The [route inventory](figma-page-inventory.md) supplies screen-level links. The [design-system reference](design-system.md) maps source components and tokens.
