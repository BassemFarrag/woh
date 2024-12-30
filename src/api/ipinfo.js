// قائمة بمفاتيح API
const apiKeys = ["8503", "b286", "380a"];

// وظيفة لجلب الموقع
export async function fetchLocation() {
  let currentKeyIndex = 0;

  while (currentKeyIndex < apiKeys.length) {
    try {
      const apiKey = apiKeys[currentKeyIndex];
      const response = await axios.get(`https://ipinfo.io/json?token=${apiKey}`);
      return response.data; // إرجاع بيانات الموقع
    } catch (error) {
      console.error(`Error with API key ${apiKeys[currentKeyIndex]}:`, error.message);
      currentKeyIndex++; // التبديل إلى المفتاح التالي
    }
  }

  throw new Error("All API keys have failed.");
}
