# JOURNAL.md — Decision Journal

## 1\. Prioritization

* What did you decide to build, in what order, and why?

Befor implementation, I have decided to understand assignment and .

Implementation Order :
 1. Understand the assignment and requirements
    - Read assignment to understand which features are requested and what should I need to and don't.
 2. Choose technology stack
    - I have choose below tech stack as per my knowledge
    - Frontend : React.Js, Typescript, TailwindCSS, React-Router, Vite
    - Backend  : Node.Js, Typescritp, Express.Js, Prisma, PostgreSQL
 3. Plan architecture
    - Here I have used monolithic architecture so it is easy to maintain and future deployment.
 4. Set up project
    - For setting up project I have used AI for that where, it has setup the project.
 5. Implement core features
    - As I have already clear all requirement to the AI so all core features and designing parts was done by AI, mean while I have review code which was implemented by AI.
 6. Testing 
    - After project setup completed I have verify each and every component workflow to make sure it works correctly and not. While verify those workflow I have getting  some minor errors which I have fix.

* What did you deliberately cut or skip? Why those?

I decided to focus on building/implementing core features first and skip adding extra features or edge case scenarios. While deciding testimonials workflow I need to handle duplicate testimonials submissions by user, instead of put validation for this I leave this decision at Admin side wheather they want to show this testimonial or not.

## 2\. Key decisions

For each decision that shaped the project (aim for 3–6), one short block:

* **Decision 1:** How rejected testimonials data are handled ?
   - As of now if Admin reject any testimonials then it leave in our database as it is and waiting re-approve by admin. But what if admin never going to re-approved or approve that testimonials. So I have decided that after submitting testimonial if admin is not approve that testimonial in next 30 minutes then remove that record from database permenently without manual deletion from admin side using pg_cron functionality.
* **Options:**
  - As a optional behaviour I have assume that admin will delete those records manually but if there are too much records are there so this works become too lenghty for admin.
* **Why:**
  - Using of this functionality it is easy to manage our database effectively and also we are able handle those unused data without human involvment. 

## 3\. Working with AI agents

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
  
* **Your agent setup:** if you wrote instruction/rules files, skills, or commands (they must be committed — see the brief), say briefly what each is for and what problem it solved. If you used none, say so here.
* **Your 3–5 most important prompts:** paste them and say why each worked — or didn't.
* **At least one time AI was wrong:**
 - I instruct AI to implement validation for junk message line like "asdfdfdfdfdfvggsdg" this then show validation message like "Please enter atlest 3 meaningfull words". But here main catch is that if we write line like "this is ykkndwrehj" or "adfew huiwruer adfuyuwer" then it will accept this input as it is without showing any validation. So this is not meaningful implement.
* **Something you rejected:**
 - As I describe above I am not satisfy with this functionality so i have discard this functionality.

## 4\. Verification

* How did you convince yourself the code actually works? Be specific: what did you run, click, test, or inspect?
* What do you know is still broken or fragile?
   - so after adding honey pot functionality added in testimonial form I check this functionality by manually visible honeypot using browser devtools and then manually fill that field at that time I get to know that it has remove consentGiven field from api body and I got "Invalid Field" error.

## 5\. If I had 5 more hours

* What would you do next, in order?

