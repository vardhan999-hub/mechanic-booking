# AI Usage — ENG-159184
The ticket permitted the use of AI as a development assistant. Below is a summary of where AI was used during this project.
## What I used AI for
- Explaining implementation approaches and helping scaffold parts of the Next.js CRUD application, including the initial store structure, API route patterns, and form layout.
- Helping implement the TRD requirements such as loading states, empty states, network error handling, validation, accessibility improvements, analytics logging, and input sanitization.
- Assisting with debugging environment issues, including Tailwind configuration, a OneDrive/Next.js symlink conflict, and a Windows Firewall issue affecting local development.
- Helping migrate the project from a local `json-server` setup to Supabase after discovering that Vercel's serverless filesystem is read-only and unsuitable for persistent CRUD operations.
- Reviewing the authorization flow and suggesting improvements, which led to adding application-level role checks before create, update, and delete operations.
## What I implemented myself
- Integrated all generated suggestions into the project and modified the code where necessary.
- Built and tested the complete CRUD workflow, including create, update, delete, validation edge cases, keyboard accessibility, loading states, and analytics logging.
- Configured the Supabase project, database schema, environment variables, and deployment.
- Ran `npm run lint` and `npm run build` before each deployment and resolved all build issues.
- Reviewed the final implementation against the Technical Requirements Document before submission.
