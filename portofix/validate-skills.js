const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

// Check IDs
const regex = /id="([^"]+)"/g;
let match;
const ids = [];
while ((match = regex.exec(html)) !== null) {
    ids.push(match[1]);
}

const duplicateIds = ids.filter((item, index) => ids.indexOf(item) !== index);
console.log('Duplicate IDs in index.html:', duplicateIds);

// Check skills in html
const expectedSkills = ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'Laravel', 'Python', 'MySQL', 'Figma'];
expectedSkills.forEach(s => {
    console.log(`Skill ${s} present:`, html.includes(`>${s}</h3>`));
});

// Check scripts inclusion
const scripts = ['cert-slider.js', 'project-showcase.js', 'skills-filter.js', 'contact-form.js'];
scripts.forEach(sc => {
    console.log(`Script ${sc} loaded:`, html.includes(sc));
});

// Check integrity of other sections
const sections = ['#home', '#about', '#skills', '#certificates', '#project', '#contact'];
sections.forEach(sec => {
    console.log(`Section ${sec} exists:`, html.includes(`id="${sec.replace('#', '')}"`));
});
