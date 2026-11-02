// Android app links. Fill in URLs when ready; empty values keep fallbacks (tester -> #contact, Play button hidden).
const ANDROID_APP_LINKS = {
  testerOptIn: "", // e.g. Google Group / Play closed-test opt-in URL
  play: { pickleball: "", cornhole: "", spades: "" }
};
document.querySelectorAll("[data-tester-link]").forEach((a) => {
  if (ANDROID_APP_LINKS.testerOptIn) { a.href = ANDROID_APP_LINKS.testerOptIn; a.target = "_blank"; a.rel = "noopener noreferrer"; }
});
document.querySelectorAll("[data-app]").forEach((card) => {
  const url = ANDROID_APP_LINKS.play[card.dataset.app];
  const link = card.querySelector("[data-play-link]");
  if (url && link) { link.href = url; link.target = "_blank"; link.rel = "noopener noreferrer"; link.hidden = false; }
});
