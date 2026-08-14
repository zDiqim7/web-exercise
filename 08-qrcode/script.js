(function () {
    // ----- i18n -----
    const translations = {
        id: {
            title: 'QR Tool',
            subtitle: 'Buat QR code dari teks/link, atau baca QR code dari gambar yang diupload.',
            tabGenerate: 'Generate',
            tabDecode: 'Decode',
            labelInput: 'Link atau teks',
            placeholderInput: 'Contoh: https://youtube.com/watch?v=xxxx, atau teks bebas apa saja',
            btnGenerate: 'Buat QR Code',
            downloadLink: 'Download QR Code (.png)',
            dropZone: 'Klik untuk pilih gambar QR code, atau drag & drop di sini',
            previewAlt: 'Preview gambar QR yang diupload',
            errFileType: 'File harus berupa gambar (png/jpg).',
            errLibFailed: 'Library decoder (jsQR) gagal dimuat. Cek koneksi internet, lalu refresh halaman.',
            errReadImage: 'Terjadi error saat membaca gambar: ',
            errNoQr: 'Tidak ada QR code yang terdeteksi di gambar ini. Coba gambar yang lebih jelas/tidak buram.',
            resultLink: 'Hasil (link): ',
            resultText: 'Hasil: ',
            langToggle: 'EN',
        },
        en: {
            title: 'QR Tool',
            subtitle: 'Create a QR code from text/link, or read a QR code from an uploaded image.',
            tabGenerate: 'Generate',
            tabDecode: 'Decode',
            labelInput: 'Link or text',
            placeholderInput: 'Example: https://youtube.com/watch?v=xxxx, or any free text',
            btnGenerate: 'Generate QR Code',
            downloadLink: 'Download QR Code (.png)',
            dropZone: 'Click to choose a QR code image, or drag & drop here',
            previewAlt: 'Preview of the uploaded QR image',
            errFileType: 'File must be an image (png/jpg).',
            errLibFailed: 'The decoder library (jsQR) failed to load. Check your internet connection, then refresh the page.',
            errReadImage: 'An error occurred while reading the image: ',
            errNoQr: 'No QR code detected in this image. Try a clearer/less blurry image.',
            resultLink: 'Result (link): ',
            resultText: 'Result: ',
            langToggle: 'ID',
        },
    };

    let currentLang = 'id';

    function applyLanguage(lang) {
        currentLang = lang;
        const t = translations[lang];

        document.documentElement.lang = lang;
        document.getElementById('txt-title').textContent = t.title;
        document.getElementById('txt-subtitle').textContent = t.subtitle;
        document.getElementById('tab-generate').textContent = t.tabGenerate;
        document.getElementById('tab-decode').textContent = t.tabDecode;
        document.getElementById('txt-label-input').textContent = t.labelInput;
        document.getElementById('input-text').placeholder = t.placeholderInput;
        document.getElementById('btn-generate').textContent = t.btnGenerate;
        document.getElementById('download-link').textContent = t.downloadLink;
        document.getElementById('drop-zone').textContent = t.dropZone;
        document.getElementById('preview-img').alt = t.previewAlt;
        document.getElementById('lang-toggle').textContent = t.langToggle;
    }

    document.getElementById('lang-toggle').addEventListener('click', () => {
        applyLanguage(currentLang === 'id' ? 'en' : 'id');
    });

    applyLanguage('id');

    // ---------- Tab switching ----------
    const tabGenerate = document.getElementById('tab-generate');
    const tabDecode = document.getElementById('tab-decode');
    const sectionGenerate = document.getElementById('section-generate');
    const sectionDecode = document.getElementById('section-decode');

    function showTab(tab) {
        const isGenerate = tab === 'generate';
        tabGenerate.classList.toggle('active', isGenerate);
        tabDecode.classList.toggle('active', !isGenerate);
        sectionGenerate.classList.toggle('active', isGenerate);
        sectionDecode.classList.toggle('active', !isGenerate);
    }
    tabGenerate.addEventListener('click', () => showTab('generate'));
    tabDecode.addEventListener('click', () => showTab('decode'));

    // ---------- GENERATE ----------
    const inputText = document.getElementById('input-text');
    const btnGenerate = document.getElementById('btn-generate');
    const qrOutput = document.getElementById('qr-output');
    const downloadLink = document.getElementById('download-link');

    let qrInstance = null;

    btnGenerate.addEventListener('click', () => {
        const text = inputText.value.trim();
        if (!text) return;

        qrOutput.innerHTML = '';
        downloadLink.className = '';

        // qrcode.js renders into a container div
        qrInstance = new QRCode(qrOutput, {
            text: text,
            width: 240,
            height: 240,
            correctLevel: QRCode.CorrectLevel.M,
        });

        // qrcode.js draws to a <canvas> (or <img> fallback) inside qrOutput;
        // give it a tick to render, then wire up the download link.
        setTimeout(() => {
            const canvas = qrOutput.querySelector('canvas');
            if (canvas) {
                downloadLink.href = canvas.toDataURL('image/png');
                downloadLink.className = 'show';
            }
        }, 50);
    });

    // ---------- DECODE ----------
    const dropZone = document.getElementById('drop-zone');
    const inputFile = document.getElementById('input-file');
    const previewImg = document.getElementById('preview-img');
    const decodeResult = document.getElementById('decode-result');

    dropZone.addEventListener('click', () => inputFile.click());

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    inputFile.addEventListener('change', () => {
        if (inputFile.files.length) {
            handleFile(inputFile.files[0]);
        }
    });

    function handleFile(file) {
        if (!file.type.startsWith('image/')) {
            showResult(false, translations[currentLang].errFileType);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
            previewImg.className = 'show';

            const img = new Image();
            img.onload = () => decodeFromImage(img);
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function decodeFromImage(img) {
        const t = translations[currentLang];

        if (typeof jsQR !== 'function') {
            showResult(false, t.errLibFailed);
            return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        let code;
        try {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            code = jsQR(imageData.data, imageData.width, imageData.height);
        } catch (err) {
            console.error('jsQR error:', err);
            showResult(false, t.errReadImage + err.message);
            return;
        }

        if (!code) {
            showResult(false, t.errNoQr);
            return;
        }

        const text = code.data;
        const isUrl = /^https?:\/\//i.test(text);

        if (isUrl) {
            decodeResult.innerHTML =
                t.resultLink + '<a href="' + text + '" target="_blank" rel="noopener noreferrer">' + text + '</a>';
        } else {
            decodeResult.textContent = t.resultText + text;
        }
        decodeResult.className = 'result show ok';
    }

    function showResult(ok, message) {
        decodeResult.textContent = message;
        decodeResult.className = 'result show ' + (ok ? 'ok' : 'err');
    }
})();