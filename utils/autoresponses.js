// Registry of chat auto-response triggers/replies (cat, dog, ...).
// To add a new type (e.g. a "fox" reply), add an entry here - no other code changes needed.

module.exports.autoresponses = {
  cat: {
    label: "Cat replies",
    emoji: "🐱",
    triggers: ["meow"],
    replies: [
      "Meow! 🐱",
      "😺 Meow meow!",
      "Mew~",
      "Purr~ 😻",
      "Nya~ ✨",
      "*eepy meow...* 💤",
      "MEOW!!",
      "🐾 *pounces on you* meow!",
    ],
  },
  dog: {
    label: "Dog replies",
    emoji: "🐶",
    triggers: ["woof", "bark", "bork", "ruff", "arf"],
    replies: [
      "Woof! 🐶",
      "Bark bark! 🐾",
      "bork bork!",
      "Ruff~ 🐕",
      "*wags tail excitedly*",
      "🐶 *gives you a slobbery kiss*",
    ],
  },
};
