🔗 Live Demo: Live Demo: [Live URL](https://bookmark-app-nine-silk.vercel.app/)
📦 GitHub Repository: [GitHub Link](https://github.com/THARUN-KUMAR-GOULI/Bookmark_App)

# Smart Bookmark App



# Bookmark_App

A modern web application that allows users to securely save, manage, and organize their favorite website links. Users can **authenticate** using Google, add bookmarks with titles, view them in real time, and delete them when no longer needed.

The application focuses on a **clean UI**, **secure authentication**, and **real-time updates** for a smooth user experience.

---

## Features

* Google Authentication (OAuth)

* Add and store bookmarks securely

* Real-time bookmark updates

* Delete bookmarks instantly

* Responsive and modern UI

* Hosted and deployed online

---

## Challenges Faced & Solutions

### 1.) Google OAuth Redirect Configuration

#### Challenge
Initially failed to authenticate users due to incorrect redirect URLs between Supabase and Google Cloud Console.

#### Solution
Later configured matching redirect URLs in Supabase Authentication settings and Google OAuth credentials for both local and production environments. This resolved authentication failures and enabled successful login.



### 2.) Tailwind CSS was not properly initialized at the beginning of the project

#### Challenge
Tailwind CSS was not properly initialized at the beginning of the project. Because of this, several utility classes were not applying correctly.

#### Solution
Then verified the Tailwind installation and ensured that global styles were imported correctly. While resolving configuration issues, temporarily used custom utility values like h-[20px], w-[32px], to maintain layout consistency. Once Tailwind was stabilized, we standardized most styling using Tailwind utilities.


#### 3.) GitHub Push & Version Control Conflicts

#### Challenge
While pushing the project to GitHub, merge conflicts occurred due to differences between the local and remote repository histories.

#### Solution
Resolved conflicts manually, rebased the branch, and ensured the correct branch structure before pushing. This helped maintain a clean commit history and successful deployment.



#### 4.) Deployment Configuration on Vercel

#### Challenge
Deployment initially failed because environment variables were not configured properly and project naming rules were not followed.

#### Solution
Then checked and added required environment variables (Supabase URL and API key) in Vercel settings and renamed the project using lowercase characters only, which allowed successful deployment.

---

## Learn Outcomes

* Learned OAuth authentication integration

* Understood real-time database updates

* Gained experience with deployment workflows

* Improved debugging and configuration skills

---

## Author

Developed by
# Tharun Kumar


