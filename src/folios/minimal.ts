export function minimal(data: any) {
	const pi = data.personalInformation || {};
	const projects = Array.isArray(data.projects) ? data.projects : [];
	const work = Array.isArray(data.workExperience) ? data.workExperience : [];
	const skills = data.skills || {};
	const allSkills = [
		...(skills.languages || []),
		...(skills.frameworks || []),
		...(skills.tools || []),
	];

	const hasExperience = work.length > 0;
	const hasProjects = projects.length > 0;
	const hasSkills = allSkills.length > 0;

	const socialLinks = `
		${
			pi.linkedinLink
				? `<a href="${pi.linkedinLink}" target="_blank" class="rounded-full ps-0 p-1" aria-label="LinkedIn">
							<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" class="text-zinc-900 dark:text-zinc-300" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"></path></svg>
						</a>`
				: ""
		}
		${
			pi.twitterLink
				? `<a href="${pi.twitterLink}" target="_blank" class="rounded-full p-1" aria-label="Twitter / X">
							<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" class="text-zinc-900 dark:text-zinc-300" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path></svg>
						</a>`
				: ""
		}
		${
			pi.githubLink
				? `<a href="${pi.githubLink}" target="_blank" class="rounded-full p-1" aria-label="GitHub">
							<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 496 512" class="text-zinc-900 dark:text-zinc-300" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path></svg>
						</a>`
				: ""
		}
		${
			pi.email
				? `<a href="mailto:${pi.email}" target="_blank" class="rounded-full p-1" aria-label="Email">
							<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" class="text-zinc-900 dark:text-zinc-300" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M437.332 80H74.668C51.199 80 32 99.198 32 122.667v266.666C32 412.802 51.199 432 74.668 432h362.664C460.801 432 480 412.802 480 389.333V122.667C480 99.198 460.801 80 437.332 80zM432 170.667L256 288 80 170.667V128l176 117.333L432 128v42.667z"></path></svg>
						</a>`
				: ""
		}
		${
			pi.resumeLink
				? `<a href="${pi.resumeLink}" target="_blank" class="rounded-full p-1" aria-label="Resume">
							<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 256 256" class="text-zinc-900 dark:text-zinc-300" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M210.78,39.25l-130.25-23A16,16,0,0,0,62,29.23l-29.75,169a16,16,0,0,0,13,18.53l130.25,23a16,16,0,0,0,18.54-13l29.75-169A16,16,0,0,0,210.78,39.25ZM135.5,131.56a8,8,0,0,1-7.87,6.61,8.27,8.27,0,0,1-1.4-.12l-41.5-7.33A8,8,0,0,1,87.52,115L129,122.29A8,8,0,0,1,135.5,131.56Zm47-24.18a8,8,0,0,1-7.86,6.61,7.55,7.55,0,0,1-1.41-.13l-83-14.65a8,8,0,0,1,2.79-15.76l83,14.66A8,8,0,0,1,182.53,107.38Zm5.55-31.52a8,8,0,0,1-7.87,6.61,8.36,8.36,0,0,1-1.4-.12l-83-14.66a8,8,0,1,1,2.78-15.75l83,14.65A8,8,0,0,1,188.08,75.86Z"></path></svg>
						</a>`
				: ""
		}
	`;

	const experienceHtml = work
		.map(
			(w: any) => `
			<div class="flex gap-4">
				<div class="min-h-full min-w-[2px] bg-neutral-200 rounded-md"></div>
				<div class="w-full">
					<div class="flex justify-between min-w-full text-sm md:text-lg">
						<div class="text-sm">
							<div class="text-[16px] normal-case font-medium md:text-lg">${w.role || ""}</div>
							<div>at, ${w.company || ""}</div>
						</div>
					</div>
					<p class="lowercase mt-2 dark:text-zinc-200 text-zinc-800 text-md">${w.description || ""}</p>
				</div>
			</div>`
		)
		.join("");

	const projectsHtml = projects
		.map(
			(p: any) => `
			<div class="flex gap-4">
				<div class="min-h-full min-w-[2px] bg-neutral-200 rounded-md"></div>
				<div class="w-full">
					<div class="flex justify-between min-w-full text-sm md:text-lg">
						<div>
							<div class="text-lg normal-case flex gap-4 items-center">
								<span class="font-medium">${p.title || ""}</span>
							</div>
							<div class="flex gap-4">
								${
									p.liveLink
										? `<div class="flex gap-1 items-center group/live">
												<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 496 512" height="16px" width="16px" xmlns="http://www.w3.org/2000/svg"><path d="M336.5 160C322 70.7 287.8 8 248 8s-74 62.7-88.5 152h177zM152 256c0 22.2 1.2 43.5 3.3 64h185.3c2.1-20.5 3.3-41.8 3.3-64s-1.2-43.5-3.3-64H155.3c-2.1 20.5-3.3 41.8-3.3 64zm324.7-96c-28.6-67.9-86.5-120.4-158-141.6 24.4 33.8 41.2 84.7 50 141.6h108zM177.2 18.4C105.8 39.6 47.8 92.1 19.3 160h108c8.7-56.9 25.5-107.8 49.9-141.6zM487.4 192H372.7c2.1 21 3.3 42.5 3.3 64s-1.2 43-3.3 64h114.6c5.5-20.5 8.6-41.8 8.6-64s-3.1-43.5-8.5-64zM120 256c0-21.5 1.2-43 3.3-64H8.6C3.2 212.5 0 233.8 0 256s3.2 43.5 8.6 64h114.6c-2-21-3.2-42.5-3.2-64zm39.5 96c14.5 89.3 48.7 152 88.5 152s74-62.7 88.5-152h-177zm159.3 141.6c71.4-21.2 129.4-73.7 158-141.6h-108c-8.8 56.9-25.6 107.8-50 141.6zM19.3 352c28.6 67.9 86.5 120.4 158 141.6-24.4-33.8-41.2-84.7-50-141.6h-108z"></path></svg>
												<a href="${p.liveLink}" target="_blank">live</a>
												<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-up-right group-hover/live:translate-x-1 transition-all duration-300 ease-in-out"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>
											</div>`
										: ""
								}
								${
									p.repoLink
										? `<div class="flex gap-1 items-center group/github">
												<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 496 512" height="16px" width="16px" xmlns="http://www.w3.org/2000/svg"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path></svg>
												<a href="${p.repoLink}" target="_blank">github</a>
												<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-up-right group-hover/github:translate-x-1 transition-all duration-300 ease-in-out"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>
											</div>`
										: ""
								}
							</div>
						</div>
					</div>
                    <div>
                        <p class="mt-2 dark:text-zinc-200 text-zinc-800 text-md">Tech Stack:
                        ${
                            p.techStack
                                ? p.techStack.map((tech: string) => `<span>${tech}</span>`).join(", ")
                                : "Not specified"
                        }
                        </p>
                    </div>
					<p class="lowercase mt-2 dark:text-zinc-200 text-zinc-800 text-md">${p.description || ""}</p>
				</div>
			</div>`
		)
		.join("");

	const skillsHtml = allSkills
		.map(
			(s: string) => `<p class="bg-[#27272a] p-1 rounded-md px-2 dark:bg-[#3f3f46] text-white">${s}</p>`
		)
		.join("");

	const navLinks = `
		<a href="#about" class="hover:text-[#111] dark:hover:text-[#e5e7eb]">About</a>
		${hasExperience ? `<a href="#experience" class="hover:text-[#111] dark:hover:text-[#e5e7eb]">Experience</a>` : ""}
		${hasProjects ? `<a href="#projects" class="hover:text-[#111] dark:hover:text-[#e5e7eb]">Projects</a>` : ""}
		${hasSkills ? `<a href="#skills" class="hover:text-[#111] dark:hover:text-[#e5e7eb]">Skills</a>` : ""}
	`;

	const portfolioStart = `<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>${pi.name || ""}'s Portfolio</title>
		<script src="https://cdn.tailwindcss.com"></script>
		<script>
			tailwind.config = { darkMode: 'class' }
		</script>
		<style>html { scroll-behavior: smooth; }</style>
	</head>
	<body class="min-h-screen py-4 md:py-10 transition-colors duration-300 bg-white text-black dark:bg-[#121212] dark:text-white">
		<div class="w-full max-w-4xl mx-auto px-4">
			<div class="hidden md:flex justify-end items-center gap-5 text-[#6b7280] font-semibold">
				${navLinks}
				<button id="toggleModeDesktop" aria-label="Toggle dark mode">
					<span class="block dark:hidden">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>
					</span>
					<span class="hidden dark:block">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
					</span>
				</button>
			</div>
	`;

	const aboutSection = `
			<section id="about">
				<div class="flex justify-between">
					<h1 class="md:pt-10 text-xl">Hey👋, I'm ${pi.name || ""}</h1>
					<button id="toggleModeMobile" aria-label="Toggle dark mode" class="block md:hidden">
						<span class="block dark:hidden">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>
						</span>
						<span class="hidden dark:block">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
						</span>
					</button>
				</div>
				<p>${pi.bio || ""}</p>
				<div class="flex gap-4">${socialLinks}</div>
				<div class="lg:mt-8 mt-4 text-sm md:text-lg">
					<h2 class="font-semibold">About me</h2>
					<p class="mt-4">${pi.about || ""}</p>
				</div>
			</section>
	`;

	const experienceSection = work.length
		? `
			<section id="experience" class="mt-8 text-sm md:text-lg">
				<h2 class="font-semibold">Experience</h2>
				<div class="flex flex-col gap-[16px] w-full space-y-4 mt-4">
					${experienceHtml}
				</div>
			</section>
		`
		: "";

	const projectsSection = projects.length
		? `
			<section id="projects" class="mt-8 text-sm md:text-lg">
				<h2 class="font-semibold">Projects</h2>
				<div class="flex flex-col gap-[16px] w-full space-y-4 mt-4">
					${projectsHtml}
				</div>
			</section>
		`
		: "";

	const skillsSection = allSkills.length
		? `
			<section id="skills" class="mt-4">
				<h3 class="text-lg font-semibold">Skills</h3>
				<div class="flex gap-2 flex-wrap">${skillsHtml}</div>
			</section>
		`
		: "";

	const portfolioEnd = `
			</div>
			<script>
                // Enable dark mode by default
				// document.documentElement.classList.add('dark');
				const btnDesktop = document.getElementById('toggleModeDesktop');
				const btnMobile = document.getElementById('toggleModeMobile');
				function toggleDarkMode() { document.documentElement.classList.toggle('dark'); }
				if (btnDesktop) btnDesktop.addEventListener('click', toggleDarkMode);
				if (btnMobile) btnMobile.addEventListener('click', toggleDarkMode);
			</script>
		</body>
	</html>`;

	return (
		portfolioStart +
		aboutSection +
		experienceSection +
		projectsSection +
		skillsSection +
		portfolioEnd
	);
}
