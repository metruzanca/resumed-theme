// Utility functions
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatDate(dateString, defaultValue = "") {
  if (!dateString) return defaultValue;
  const date = new Date(dateString);
  const month = MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${month} ${year}`;
}

function getProfile(profiles = [], target) {
  return profiles.find(
    (item) => item.network.toLowerCase() === target.toLowerCase(),
  );
}

function allSkills(skills = []) {
  const all = [];
  for (const category of skills) {
    all.push(...category.keywords);
  }
  return all;
}

function renderMarkdownLinks(text) {
  // Basic regex to support markdown links: [text](url)
  return text.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-blue-800 font-medium">$1</a>',
  );
}

function renderLinkable(content, url) {
  if (url) {
    return `<a href="${url}" class="cursor-pointer text-blue-800">${content}</a>`;
  }
  return `<span>${content}</span>`;
}

function renderSection(name, content) {
  if (!content || content.trim() === "") return "";
  return `
    <h3 class="w-full border-gray-600 px-1 font-medium mb-2" style="border-bottom-width: 1px; box-shadow: 0 2px 2px -2px gray;">${name.toUpperCase()}</h3>
    <div class="px-2">
      ${content}
    </div>
  `;
}

// Section renderers
function renderHeader(basics) {
  if (!basics) return "";

  const github = getProfile(basics.profiles, "github");
  const linkedin = getProfile(basics.profiles, "linkedin");

  return `
    <div class="flex flex-col items-center">
      <h1 class="text-4xl mb-[-4px]">${basics.name || ""}</h1>
      <h2 class="text-lg">${basics.label || ""}</h2>
    </div>

    <div class="flex flex-col sm:flex-row items-center justify-between mx-4 text-xs">
      <div class="flex justify-between sm:justify-around w-full">
        ${basics.email ? renderLinkable(basics.email, `mailto:${basics.email}`) : ""}
        ${basics.phone ? renderLinkable(`phone: ${basics.phone}`, `tel:${basics.phone}`) : ""}
      </div>
      <div class="flex justify-between sm:justify-around w-full">
        ${github ? renderLinkable(`github: ${github.username}`, `https://github.com/${github.username}`) : ""}
        ${linkedin ? renderLinkable(`linkedin: ${linkedin.username}`, `https://www.linkedin.com/in/${linkedin.username}/`) : ""}
      </div>
    </div>
  `;
}

function renderJob(job) {
  const dateRange = `${formatDate(job.startDate)} - ${formatDate(job.endDate, "present")}`;

  let highlightsHtml = "";
  if (job.highlights && job.highlights.length > 0) {
    highlightsHtml = `
      <ul class="pl-2">
        ${job.highlights
          .map(
            (highlight) => `
          <li class="list-['-'] list-outside mr-2">
            <span class="pl-1">${renderMarkdownLinks(highlight)}</span>
          </li>
        `,
          )
          .join("")}
      </ul>
    `;
  }

  let stackHtml = "";
  if (job.stack && job.stack.length > 0) {
    const stackText = job.stack
      .map((tech) => (typeof tech === "string" ? tech : tech.text))
      .join(", ");
    stackHtml = `<b>Tech Stack: </b>${stackText}`;
  }

  return `
    <div>
      <div class="flex items-center">
        <div class="w-full">
          <div class="flex justify-between">
            ${renderLinkable(`<b>${job.name}</b>`, job.url)}
            <span class="text-xs">${job.location || ""}</span>
          </div>
          <div class="flex justify-between">
            <div class="underline">${job.position}</div>
            <span class="text-xs">${dateRange}</span>
          </div>
        </div>
      </div>

      <div class="ml-2 text-xs">
        ${job.summary ? `<div>${renderMarkdownLinks(job.summary)}</div>` : ""}
        ${highlightsHtml}
        ${stackHtml}
      </div>
    </div>
  `;
}

function renderExperience(work) {
  if (!work || work.length === 0) return "";

  const jobsHtml = work.map(renderJob).join("");
  return renderSection("Work Experience", jobsHtml);
}

function renderEducation(education) {
  if (!education || education.length === 0) return "";

  const educationHtml = education
    .map((degree) => {
      const dateRange = `${formatDate(degree.startDate)} - ${formatDate(degree.endDate, "present")}`;
      return `
      <div>
        <div class="flex justify-between">
          <b>${degree.studyType} of ${degree.area}</b>
          <span class="text-xs">${dateRange}</span>
        </div>
        <span>${degree.institution}</span>
      </div>
    `;
    })
    .join("");

  return renderSection("Education", educationHtml);
}

function renderSkills(skills) {
  if (!skills || skills.length === 0) return "";

  const allSkillsList = allSkills(skills);
  const skillsHtml = `<p class="text-xs">${allSkillsList.join(", ")}</p>`;

  return renderSection("Skills", skillsHtml);
}

// Main render function
exports.render = ({ basics, work, education, skills }) => {
  const fontUrl =
    "https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@400;500;600;700&display=swap";
  const fontFamily = "Frank Ruhl Libre";

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${basics?.name || "Resume"}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="${fontUrl}" rel="stylesheet">
    <style>
      body {
        font-family: '${fontFamily}', serif;
      }
      @media print {
        body {
          background: white;
        }
        .resume-container {
          box-shadow: none;
          margin: 0;
          max-width: none;
        }
      }
      @media (max-width: 8.5in) {
        .resume-page {
          height: max(11in, 100%);
        }
      }
    </style>
  </head>
  <body class="bg-gray-900">
    <div class="flex justify-center">
      <div class="resume-container resume-page bg-white max-w-[8.5in]" style="height: 11in;">
        <main class="text-sm px-10 py-12 text-black" style="font-family: '${fontFamily}', serif;">
          ${renderHeader(basics)}
          ${renderExperience(work)}
          ${renderEducation(education)}
          ${renderSkills(skills)}
        </main>
      </div>
    </div>
  </body>
</html>`;
};
