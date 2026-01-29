

function showRecommendations()
{
  var value = document.getElementById("genre-recommendations").value;
  var output = document.getElementById("recommendations-output");


 if (value === "romance") {
  output.innerHTML = "<h3>Romance Recommendations</h3><ul><li>Your Lie in April</li><li>Toradora!</li><li>Kaguya-sama: Love is War</li></ul>";
}

else if (value === "comedy") {
  output.innerHTML = "<h3>Comedy Recommendations</h3><ul><li>Gintama</li><li>Nichijou</li><li>The Disastrous Life of Saiki K.</li></ul>";
}

else if (value === "horror") {
  output.innerHTML = "<h3>Horror Recommendations</h3><ul><li>Another</li><li>Tokyo Ghoul</li><li>Parasyte: The Maxim</li></ul>";
}

else if (value === "action") {
  output.innerHTML = "<h3>Action Recommendations</h3><ul><li>Attack on Titan</li><li>Demon Slayer</li><li>Jujutsu Kaisen</li></ul>";
}

else if (value === "slice of life") {
  output.innerHTML = "<h3>Slice of Life Recommendations</h3><ul><li>Clannad</li><li>Barakamon</li><li>March Comes in Like a Lion</li></ul>";
}

else if (value === "isekai") {
  output.innerHTML = "<h3>Isekai Recommendations</h3><ul><li>Re:Zero − Starting Life in Another World</li><li>That Time I Got Reincarnated as a Slime</li><li>No Game No Life</li></ul>";
}

}
