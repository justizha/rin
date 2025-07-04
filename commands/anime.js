import axios from "axios";
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("anime")
    .setDescription("Get Random Anime Gif or Png By Category ! 🪄")
    .addStringOption((option) =>
      option
        .setName("category")
        .setDescription("Choose a category.")
        .setRequired(false)
        .addChoices(
          { name: "Yeet (gif)", value: "yeet" },
          { name: "Pout (gif)", value: "pout" },
          { name: "Cry (gif)", value: "cry" },
          { name: "Laugh (gif)", value: "laugh" },
          { name: "Nod (gif)", value: "nod" },
          { name: "Angry (gif)", value: "angry" }
        )
    ),
  async execute(interaction) {
    await interaction.deferReply();
    try {
      const category = interaction.options.getString("category") || "wave";
      const response = await axios.get(`https://nekos.best/api/v2/${category}`);

      const embed = new EmbedBuilder()
        .setTitle(
          `Random ${
            category.charAt(0).toUpperCase() + category.slice(1)
          } Image / Gif`
        )
        .setImage(response.data.results[0].url)
        .setColor("Blurple")
        .setFooter({
          text: "Powered by [nekos.best](https://docs.nekos.best)",
        });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("Anime API Error:", error);
      await interaction.editReply(
        "Sorry, couldn't fetch an anime image right now! 😔"
      );
    }
  },
};
