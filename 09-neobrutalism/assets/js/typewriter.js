const typewriterPhrases = [
  "Rasakan kelezatan di setiap tegukan, diolah dari biji kopi pilihan dan diseduh presisi oleh barista berpengalaman.",
  "Nikmati cita rasa sempurna dari tetes pertama sampai habis, dipetik dari biji terbaik dan diracik penuh keahlian.",
  "Manjakan lidahmu dari seruput awal hingga usai, menggunakan biji kopi berkualitasa tinggi dan ditangani langsung oleh pakar kopi.",
  "Hadirkan kenikmatan sejati di setiap cangkirnya, berbahan dasar biji kopi unggulan yang diracik khusus oleh tangan profesional.",
  "Resapi kehangatan rasa dari awal hingga akhir, dibuat dari biji kopi murni dan disajikan penuh ketelitian oleh barista andalan.",
  "Nikmati kopinya dari seruputan pertama hingga terakhir, dibuat dengan biji kopi terbaik dan diracik oleh barista profesional."
];

const typewriterText = document.querySelector("#typewriter-text");
const typewriterAnnouncement = document.querySelector("#typewriter-announcement");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (typewriterText && typewriterAnnouncement && !prefersReducedMotion.matches) {
  const typingDuration = 3000;
  const holdDuration = 3000;
  const deletionInterval = 15;
  let phraseIndex = 0;

  const typePhrase = (phrase, characterIndex = 0) => {
    if (characterIndex === phrase.length) {
      typewriterAnnouncement.textContent = phrase;
      window.setTimeout(erasePhrase, holdDuration);
      return;
    }

    typewriterText.textContent = phrase.slice(0, characterIndex + 1);
    window.setTimeout(
      () => typePhrase(phrase, characterIndex + 1),
      typingDuration / phrase.length
    );
  };

  const erasePhrase = () => {
    const currentText = typewriterText.textContent;

    if (currentText.length === 0) {
      phraseIndex = (phraseIndex + 1) % typewriterPhrases.length;
      typewriterAnnouncement.textContent = "";
      typePhrase(typewriterPhrases[phraseIndex]);
      return;
    }

    typewriterText.textContent = currentText.slice(0, -1);
    window.setTimeout(erasePhrase, deletionInterval);
  };

  typewriterText.textContent = "";
  typewriterAnnouncement.textContent = "";
  typePhrase(typewriterPhrases[phraseIndex]);
}
