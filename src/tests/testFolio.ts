import fs from "fs/promises";
import path from "path";
import { pathToFileURL } from "url";

try {
    require('ts-node').register({ transpileOnly: true });
} catch (e) {
}

const folioConfig = {
    personalInformation: {
        name: 'Dev Duo',
        email: 'devduocollab@gmail.com',
        bio: 'Full Stack Developer',
        about:
            'Intern at Xendev | Full Stack Developer | Open Source Contributor',
        githubLink: 'https://github.com/xen-devs',
        linkedinLink: 'https://www.linkedin.com',
        twitterLink: 'https://x.com',
        resumeLink:
            'https://www.depts.ttu.edu/coe/careers/students/documents/Sample-Resume-2022.pdf'
    },
    skills: {
        languages: ['C++', 'Python', 'Java', 'JavaScript', 'TypeScript'],
        tools: ['Turborepo', 'Figma', 'Postman', 'Git', 'Azure', 'Docker'],
        frameworks: ['React', 'Express', 'Next.js', 'Node.js', 'Tailwind CSS']
    },
    projects: [
        {
            title: 'Mark Me',
            description:
                'Mobile app for hosting events, managing participants, and tracking check-ins with role-based access.',
            techStack: [
                'React Native',
                'Expo',
                'Node.js',
                'Express.js',
                'MongoDB',
                'TypeScript'
            ],
            image: 'https://vigneshvaranasi.in/assets/markme-DtNTkQTw.png',
            repoLink: 'https://github.com/pavancos/markme',
            liveLink: 'https://github.com/pavancos/markme/releases/tag/v1.0.0'
        },
        {
            title: 'AskIt',
            description:
                'Real-time anonymous Q&A platform with upvoting, threaded discussions, and secure OAuth 2.0 login.',
            techStack: [
                'React.js',
                'WebSockets',
                'Node.js',
                'Express.js',
                'MongoDB',
                'TypeScript',
                'Tailwind CSS'
            ],
            image: 'https://vigneshvaranasi.in/assets/askit-B45JEGme.png',
            repoLink: 'https://github.com/skfakruddin/AskIt',
            liveLink: 'https://askitengine.centralindia.cloudapp.azure.com/'
        }
    ],
    workExperience: [
        {
            role: 'Software Developer Intern',
            company: 'One Tech Company',
            techStack: ['Java', 'Spring Boot', 'React', 'MySQL'],
            description:
                'Developed REST APIs, integrated with front-end components, and optimized database queries for better performance.'
        },
        {
            role: 'Web Developmer Intern',
            company: 'Some other Tech Company',
            techStack: ['React.js', 'Node.js', 'MongoDB'],
            description:
                'Collaborated on building web solutions, organized coding events, and contributed to open-source projects.'
        }
    ]
}

async function main() {
    let folioName = process.argv[2];

    if (!folioName && process.env.npm_config_argv) {
        try {
            const parsed = JSON.parse(process.env.npm_config_argv);
            const original = parsed.original || [];
            folioName = original[2] || original[1];
        } catch {
        }
    }

    folioName = folioName || process.env.FOLIO_NAME || 'classic';

    const templates: { [key: string]: (data: any) => string } = {};
    try {
        const classicMod = await import(pathToFileURL(path.resolve(process.cwd(), 'src/folios/classic.ts')).href);
        const minimalMod = await import(pathToFileURL(path.resolve(process.cwd(), 'src/folios/minimal.ts')).href);
        if (classicMod && classicMod.classic) templates['classic'] = classicMod.classic;
        if (minimalMod && minimalMod.minimal) templates['minimal'] = minimalMod.minimal;
    } catch (e) {
    }

    const template = templates[folioName];
    if (!template) {
        console.error(`Folio template "${folioName}" not found. Available: ${Object.keys(templates).join(', ')}`);
        process.exit(1);
    }

    const html = template(folioConfig);

    const outDir = path.resolve(process.cwd(), 'public');
    await fs.mkdir(outDir, { recursive: true });
    const outPath = path.join(outDir, `${folioName}.html`);
    await fs.writeFile(outPath, html, 'utf8');

    console.log(`Your new folio is live at http://localhost:3000/${folioName}`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});