import axios from "axios";
import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("manga")
    .setDescription("Get Manga Recomendations by category / genre or random")
    .addStringOption((option) =>
      option
        .setName("category")
        .setDescription("Chose a category")
        .setRequired("false")
        .addChoices({ name: "Shonen", value: "shonen" })
    ),

  async execute(interaction) {
    await interaction.deferReply();
    try {
                
    } catch (error) {
        
    }
  },
};
