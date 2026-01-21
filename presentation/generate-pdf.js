const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generatePDF() {
    const slidesPath = path.join(__dirname, 'slides.html');
    const outputPath = path.join(__dirname, 'arcent-presentation.pdf');

    console.log('Starting PDF generation...');
    console.log('Input:', slidesPath);
    console.log('Output:', outputPath);

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Set viewport to match reveal.js dimensions
    await page.setViewport({
        width: 1100,
        height: 700,
        deviceScaleFactor: 2
    });

    // Load slides.html with reveal.js print-pdf mode
    const fileUrl = `file://${slidesPath}?print-pdf`;
    console.log('Loading:', fileUrl);

    await page.goto(fileUrl, {
        waitUntil: 'networkidle2',
        timeout: 60000
    });

    // Wait for fonts and reveal.js to load
    await page.waitForFunction(() => {
        return document.fonts.ready && typeof Reveal !== 'undefined' && Reveal.isReady();
    }, { timeout: 30000 });

    // Additional wait for styles to fully apply
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Generating PDF...');

    await page.pdf({
        path: outputPath,
        format: 'A4',
        landscape: true,
        printBackground: true,
        margin: {
            top: '0',
            right: '0',
            bottom: '0',
            left: '0'
        },
        preferCSSPageSize: true
    });

    await browser.close();

    const stats = fs.statSync(outputPath);
    console.log(`\n✅ PDF generated successfully!`);
    console.log(`📄 File: ${outputPath}`);
    console.log(`📦 Size: ${(stats.size / 1024).toFixed(2)} KB`);
}

generatePDF().catch(err => {
    console.error('Error generating PDF:', err);
    process.exit(1);
});
