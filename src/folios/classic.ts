export function classic(data:any) {
    // Removed escaping helper per request; only ensure attributes are quoted.
    console.log('data.personalInformation: ', data.personalInformation);
    // Notch

    let Notch = `
<header class="sticky top-5 flex flex-row justify-between w-11/12 md:w-8/12 px-4 md:px-12 py-3  md:py-5 mx-auto mt-4  border-[#eeeeee21] border-2 backdrop-blur-lg bg-[#1f22232c] text-neutral-50  rounded-full
        mb-8">
    <h1 class="text-xl md:text-2xl ">${data.personalInformation.name}</h1>

    <span class="hover:text-blue-200 px-2 rounded-full">
        <a class="text-xl md:text-2xl" href="${data.personalInformation.resumeLink}" download="${data.personalInformation.name}_resume.pdf" target="_blank" rel="noopener noreferrer">Resume</a>
    </span>
</header>
`

    // Hero Section
    let Hero = `
<section
    class="flex flex-col justify-center pb-28 md:pb-28 gap-8 mx-auto w-[98vw] md:w-8/12 h-[82vh] px-4 md:px-12">
    <main class="flex flex-col">
        <h1 class="text-3xl md:text-5xl">
            Hi, I am
            <span class="text-[#3FA2F6]">
                ${data.personalInformation.name}
            </span>
        </h1>
        <p class="text-[#ffffffc7] text-lg md:text-2xl">
            ${data.personalInformation.bio}
        </p>
    </main>
    <p class="text-[#ffffffc7] text-xl md:text-2xl text-justify">
        ${data.personalInformation.about}
    </p>
</section>
`

    // Projects
    const projects = data.projects || [];

    let FullProjects = "";

    if (projects.length > 0) {

        let projectsStart = `
        <div class="sm:w-8/12 sm:px-12 px-4 mx-auto">
        <h1 class="py-6 text-4xl text-[#3FA2F6]">Projects</h1>
        <div class="flex flex-col">
    `
        let projectsEnd = `
        </div>
        </div>
    `
        let projectsDiv = "";
        projects.forEach((pro:any) => {
            projectsDiv += `
        <div class="bg-[#1f2223] rounded-lg mb-12">
    ${pro.image ? `<img src="${pro.image}" class="w-full rounded-t-lg" alt="${pro.title}">` : ""
                }
            <div class="px-3 py-3">
                <h1 class="text-2xl">${pro.title}</h1>
                <p class="py-4 text-justify">
                ${pro.description}
                </p>
                <p class="py-3 font-semibold">
                ${pro.techStack}
                </p>
                <div class="flex gap-3">
                    <a class="border-[#242424] border-2 bg-[#27282c] rounded-lg p-1 text-white hover:shadow-[0_0_8px_rgba(0,0,0,0.1),0_0_5px_rgba(255,255,255,0.2)] transition-shadow duration-300" href="${pro.liveLink}" target="_blank" rel="noopener noreferrer"> Live Preview </a>
                    <a class="border-[#242424] border-2 bg-[#27282c] rounded-lg p-1 text-white hover:shadow-[0_0_8px_rgba(0,0,0,0.1),0_0_5px_rgba(255,255,255,0.2)] transition-shadow duration-300" href="${pro.repoLink}" target="_blank" rel="noopener noreferrer"> Repository Link </a>
                </div>
            </div>
        </div>
    `;
        });

        FullProjects = projectsStart + projectsDiv + projectsEnd;
    }

    // Work Experience
    const work = data.workExperience || [];
    let FullWork = "";
    let worksDiv = "";
    if (work.length > 0) {
        let workStart = `
    <div class="sm:w-8/12 sm:px-12 px-4 mx-auto">
    <h1 class="py-6 text-4xl text-[#FCAD00]">Work Experience</h1>
    <div class="flex flex-col">
    `
        let workEnd = `
    </div >
    </div >
    `

        work.forEach((w:any) => {
            worksDiv += `
        <div class="bg-[#1f2223] rounded-lg mb-12">
            <div class="px-3 py-3">
                <h1 class="text-2xl">${w.role}</h1>
                <p class="py-4 text-justify">
                    ${w.description}
                </p>
                <p class="py-3 font-semibold">
                    ${w.techStack}
                </p>
            </div>
        </div>
        `
        });

        FullWork = workStart + worksDiv + workEnd;
    }


    // Skills
    const skills = data.skills || [];
    let languages = skills.languages || [];
    let frameworks = skills.frameworks || [];
    let tools = skills.tools || [];


    let skillsStart = `
    <div class="sm:w-8/12 sm:px-12 px-4 mx-auto">
        <h1 class="py-6 text-4xl text-[#7695FF]">Skills</h1>
        <div class="bg-[#1f2223] rounded-lg mb-12 ">
`
    let skillsEnd = `
        </div>
    </div>
`

    let languagesDiv = "";

    if (languages.length > 0) {
        languagesDiv = `
    <div class="px-3 py-3">
    <h1 class="text-xl font-semibold">Languages</h1>
    <div class="flex gap-3 mt-2">
    `+ languages.map((lang:any) => {
            return `<p class="border-[#242424] border-2 bg-[#27282c] rounded-lg p-1 text-white hover:shadow-[0_0_8px_rgba(0,0,0,0.1),0_0_5px_rgba(255,255,255,0.2)] transition-shadow duration-300"> ${lang} </p>`
        }).join('') + ` 
    </div>
    </div>
    `
    };

    let frameworksDiv = "";
    if (frameworks.length > 0) {
        frameworksDiv = `
    <div class="px-3 py-3">
    <h1 class="text-xl font-semibold">Frameworks</h1>
    <div class="flex gap-3 mt-2">
    `+ frameworks.map((fw:any) => {
            return `<p class="border-[#242424] border-2 bg-[#27282c] rounded-lg p-1 text-white hover:shadow-[0_0_8px_rgba(0,0,0,0.1),0_0_5px_rgba(255,255,255,0.2)] transition-shadow duration-300"> ${fw} </p>`
        }).join('') + ` 
    </div>
    </div>
    `
    }

    let toolsDiv = "";
    if (tools.length > 0) {
        toolsDiv = `
    <div class="px-3 py-3">
    <h1 class="text-xl font-semibold">Tools</h1>
    <div class="flex gap-3 mt-2">
    `+ tools.map((tool:any) => {
            return `<p class="border-[#242424] border-2 bg-[#27282c] rounded-lg p-1 text-white hover:shadow-[0_0_8px_rgba(0,0,0,0.1),0_0_5px_rgba(255,255,255,0.2)] transition-shadow duration-300"> ${tool} </p>`
        }).join('') + ` 
    </div>
    </div>
    `
    }
    let FullSkills = skillsStart + languagesDiv + frameworksDiv + toolsDiv + skillsEnd;
    // Contact Me
    let Contact = `
        <div class="sm:w-8/12 sm:px-12 px-4 mx-auto">
            <h1 class="py-6 text-4xl text-[#F16E5F]">Contact Me</h1>
            <div class="bg-[#1f2223] rounded-lg mb-12">
                <div class="px-3 py-3">
                    ${data.personalInformation.email
            ? `<h1 class="font-semibold">Email: ${data.personalInformation.email}</h1>`
            : ""}
                    <div class="flex gap-3 mt-2">
                        ${data.personalInformation.linkedinLink
            ? `<a class="border-[#242424] border-2 bg-[#27282c] rounded-lg p-1 text-white hover:shadow-[0_0_8px_rgba(0,0,0,0.1),0_0_5px_rgba(255,255,255,0.2)] transition-shadow duration-300" href="${data.personalInformation.linkedinLink}" target="_blank" rel="noopener noreferrer"> LinkedIn </a>`
            : ""}
                        ${data.personalInformation.githubLink
            ? `<a class="border-[#242424] border-2 bg-[#27282c] rounded-lg p-1 text-white hover:shadow-[0_0_8px_rgba(0,0,0,0.1),0_0_5px_rgba(255,255,255,0.2)] transition-shadow duration-300" href="${data.personalInformation.githubLink}" target="_blank" rel="noopener noreferrer"> GitHub </a>`
            : ""}
                        ${data.personalInformation.twitterLink
            ? `<a class="border-[#242424] border-2 bg-[#27282c] rounded-lg p-1 text-white hover:shadow-[0_0_8px_rgba(0,0,0,0.1),0_0_5px_rgba(255,255,255,0.2)] transition-shadow duration-300" href="${data.personalInformation.twitterLink}" target="_blank" rel="noopener noreferrer"> Twitter </a>`
            : ""}
                    </div>
                </div>
            </div>
        </div>
    `;

    let portfolioStart = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>

<style>
    body {
        font-family: 'Inter', sans-serif;
        background-color: #161616;
        color: #ededed;
    }
</style>

<body class="">
`

    let portfolioEnd = `
</body>
</html>
`

    let Fullportfolio = portfolioStart + Notch + Hero + FullProjects + FullWork + FullSkills + Contact + portfolioEnd;

    return Fullportfolio;
}