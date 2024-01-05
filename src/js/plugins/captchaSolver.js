const fetch = require('node-fetch');
const fs = require('fs');
const FormData = require('form-data');

const key = '';
const url = 'http://api.cap.guru/in.php';

async function solveCaptcha(filePath) {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));

    try {
        const response = await fetch(`${url}?key=${key}&method=post`, {
            method: 'POST',
            body: formData,
            headers: {
                ...formData.getHeaders(),
            },
        });

        const responseData = await response.text();

        if (response.status === 200 && responseData.includes('OK')) {
            const reqid = responseData.split('|')[1];
            return await pollCaptchaResult(reqid);
        } else {
            console.log(responseData);
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function pollCaptchaResult(reqid) {
    const pollInterval = 3000; // 3 seconds
    const maxAttempts = 40;
    let attempts = 0;

    const okRegex = /^OK\|(.+)$/;

    while (attempts < maxAttempts) {
        try {
            const response = await fetch(`http://api.cap.guru/res.php?key=${key}&action=get&id=${reqid}`);
            const responseData = await response.text();

            if (responseData.includes('CAPCHA_NOT_READY')) {
                attempts++;
                await sleep(pollInterval);
            } else {
                const match = responseData.match(okRegex);
                if (match) {
                    return match[1];
                } else {
                    console.log(responseData);
                    return null;
                }
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = {
    solveCaptcha
}