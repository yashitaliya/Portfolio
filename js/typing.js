document.addEventListener("DOMContentLoaded", () => {
  const typingElement = document.querySelector(".typing-effect");
  if (!typingElement) return;

  const fullText = "Crafting Android, web, and Flutter apps that deliver clean design and real impact.";
  typingElement.textContent = "";
  let i = 0;

  function typeWriter() {
    if (i < fullText.length) {
      typingElement.textContent += fullText.charAt(i);
      i++;
      setTimeout(typeWriter, 40); // speed in ms (lower = faster)
    } else {
      // Wait for a delay before starting the typing effect again
      setTimeout(() => {
        typingElement.textContent = "";
        i = 0;
        typeWriter();
      }, 2000); // delay in ms
    }
  }

  typeWriter();
});