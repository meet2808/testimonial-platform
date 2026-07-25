# JOURNAL.md — Decision Journal

## 1. Prioritization

* What did you decide to build, in what order, and why?

Before starting the implementation, I first focused on understanding the assignment requirements and deciding on the overall development approach.

Implementation Order:
1. Understand the assignment and requirements
   - I carefully reviewed the assignment to understand the required features, project constraints, evaluation criteria, and the features that were explicitly marked as out of scope.
2. Choose technology stack
   - I selected the following technology stack based on my previous experience and because it matched the assignment requirements while allowing me to develop the project efficiently.
   - Frontend : React.Js, Typescript, TailwindCSS, React-Router, Vite
   - Backend  : Node.Js, Typescritp, Express.Js, Prisma, PostgreSQL
3. Plan architecture
   - I chose a monolithic architecture because the project is relatively small, easier to maintain, and does not require the complexity of a microservices-based architecture. It also simplifies local development and deployment.
4. Set up project
   - For the initial project setup, I used AI to scaffold both the frontend and backend projects. This allowed me to spend more time reviewing the architecture and implementing the application features.
5. Implement core features
   - After explaining the project requirements and expected workflow to the AI, I used it to generate the initial implementation of the core features and UI. I reviewed the generated code, verified that it matched the assignment requirements, and made corrections whenever necessary before accepting the implementation.
6. Testing 
   - After the implementation was completed, I tested every major workflow to ensure it behaved as expected. During testing, I found a few implementation issues, fixed them, and re-tested the affected functionality.

* What did you deliberately cut or skip? Why those?
  - Instead of automatically rejecting duplicate testimonials, I decided to leave the final decision to the administrator. This reduces the risk of rejecting legitimate submissions while keeping the moderation workflow simple.

## 2. Key decisions

For each decision that shaped the project (aim for 3–6), one short block:

* **Decision 1:** How rejected testimonials data are handled ?
  * **Decision:**
    - Rejected testimonials remain in the database temporarily. If a rejected testimonial is not approved within the configured retention period, it is automatically removed using PostgreSQL's pg_cron extension.
  * **Options:**
    - Manually deleting rejected testimonials from the dashboard.
    - Keeping rejected testimonials permanently.
  * **Why:**
    - Using of this functionality it is easy to manage our database effectively and also we are able handle those unused data without human involvment.

* **Decision 2:** Widget Implementation ?
  * **Decision:**
    - Implemented the embeddable widget using an iframe.
  * **Options:**
    - Javascript `<script>` widget
    - iframe
  * **Why:**
    - I chose the iframe approach because it provides complete style isolation from the host website, avoids CSS conflicts, and is simpler to integrate while still satisfying the assignment requirements.

* **Decision 3:** Spam Protection
  * **Decision:**
    - Implemented a honeypot field to detect basic bot submissions.
  * **Options:**
    - reCAPTCH field
  * **Why:**
    - A honeypot is lightweight, easy to implement, invisible to legitimate users, and effectively blocks many simple automated bots without affecting the user experince.

## 3. Working with AI agents

* **Tools and models used:** 
  - Here I have used Antigravity Code Editor in that for this project i have used below models for different purpose :

    | Model | Use case |
    |---|---|
    | `Claude Sonnet 4.6 (Thinking)` | Project setup |
    | `Gemini 3.6 Flash (Medium)` | Implementation conversation |

* **How you split the work:** 
  Before implementation, I reviewed the assignment requirements and decided on the technology stack and overall development approach.

  I used AI too :
  - Discuss the project architecture.
  - Set up the frontend and backend projects
  - Generate implementation for individual features.
  - Suggest improvements and refactoring.
  - Explain unfamiliar concepts and implementation details.

  My responsibilities :
  - Making architectural and technology decisions.
  - Reviewing the generated code before accepting it.
  - Testing features end-to-end.
  - Fixing issues found during testing.
  - Ensuring the final implementation matched the assignment requirements.

### 3. Your agent setup
  - I not write any SKILLS or RULES file for agents.

### 4. My 3 Most Important Prompts

#### Prompt 1 — Project Planning & Architecture

**Prompt**

I instructed the AI to act as a **Staff Software Engineer and Software Architect** instead of immediately generating code.

The prompt asked the AI to:

- Understand the assignment first.
- Explain the project, business flow, system flow, and data flow.
- Analyze functional and non-functional requirements.
- Design the application architecture.
- Create an implementation roadmap.
- Wait for my approval before writing any code.
- Discuss every major technical decision before implementation.

**Why it worked**

This prompt helped me understand the project before implementation and created a clear development plan instead of immediately jumping into coding. It also encouraged a review-first workflow where I approved major architectural decisions before implementation.

---

#### Prompt 2 — Requirement Clarification

**Prompt**

I asked the AI to review the proposed Nice-to-Have features and only keep **Avatar fallback with initials** as a Version 1 enhancement. I instructed it not to recommend or implement any other Nice-to-Have features unless I explicitly requested them.

I also asked how to make the embeddable `/widget` page automatically match the branding of any website by supporting an **accent color** through URL query parameters while keeping the widget isolated from the parent website's CSS.

**Why it worked**

This helped keep the project focused on the assignment scope and avoided unnecessary features. It also resulted in a simple widget customization approach that allows the same widget to be embedded on different websites while matching each site's branding.

---

#### Prompt 3 — Bug Investigation

**Prompt**

Do not immediately provide a solution. First explain the root cause of the issue, then discuss possible approaches, and finally implement the most suitable fix after explaining the trade-offs.

**Why it worked**

This helped me understand implementation issues instead of simply copying AI-generated fixes. It also improved my understanding of the generated code.

---

## 5. At least one time AI was wrong
  - I asked AI to implement validation for meaningless testimonial message line like "asdfdfdfdfdfvggsdg". The implementation attempted to validate the input by checking for a minimum number of words. However, I discovered that messages like
    ```text
      this is ykkndwrehj
    ```
    or
    ```text
    adfew huiwruer adfuyuwer
    ```
    still passed validation even though they were not meaningful.

* **Something you rejected:**
  - Since the validation could not reliably distinguish meaningful testimonials from random words, I decided not to include this implementation in the final project.

## 6. Verification

* How did you convince yourself the code actually works? Be specific: what did you run, click, test, or inspect?
  I manually tested every major workflow in the application
  - Submitted testimonials through the public form.
  - Verified that testimonials were stored correctly in PostgreSQL.
  - Confirmed that new testimonials appeared as Pending in the moderation dashboard.
  - Approved testimonials and verified that they appeared on the public testimonial wall.
  - Rejected testimonials and confirmed that they never appeared on the public wall.
  - Tested the embeddable widget on a separate HTML page.
  - Verified widget customization using different accent colors.
  - Tested the honeypot implementation by exposing the hidden field using the browser's Developer Tools and manually entering a value.
  - Verified API responses using the browser's Network tab and inspected database records whenever necessary.

* What do you know is still broken or fragile?
  - The honeypot implementation protects against basic automated bots but is not sufficient for more advanced spam bots.
  - Duplicate testimonial detection currently relies on administrator review instead of automatic similarity detection.
  - I discovered an issue while testing the honeypot implementation where exposing the hidden field caused the consentGiven field to be omitted from the request body, resulting in an "Invalid Field" error. After identifying the issue, I corrected the implementation and verified the workflow again.

## 7. If I had 5 more hours
  Given an additional five hours, I would focus on improving the project rather than adding many new features.
  - Enhance duplicate testimonial detection by highlighting possible duplicates for the administrator instead of relying only on manual review.
  - Improve the embeddable widget by adding more customization options, such as multiple layouts and themes.
