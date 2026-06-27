/* =====================================================================
   nutrition-api.js — API Ninjas Nutrition access layer (ES6 class)

   Wraps the API Ninjas Nutrition endpoint (free tier).
   - Endpoint: https://api.api-ninjas.com/v1/nutrition?query=...
   - Auth:     API key in the "X-Api-Key" request header
   - The query is natural-language text; the API parses out each food/drink
     item and returns nutrition facts for each. We pass a comma-separated
     list of coffee drinks and get back an array of items.

   Key is read from CONFIG (config.js), not hard-coded.
   ===================================================================== */
class NutritionAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.base = "https://api.api-ninjas.com/v1/nutrition";
  }

  /**
   * @param {string} query  natural-language food/drink text
   * @returns {Promise<Array>} array of nutrition item objects
   */
  async lookup(query) {
    const url = `${this.base}?query=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: { "X-Api-Key": this.apiKey },
    });

    if (!res.ok) {
      throw new Error(`API Ninjas responded with ${res.status}`);
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  }
}
