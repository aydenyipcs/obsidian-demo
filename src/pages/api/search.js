
export default async function handler(req, res) {
  const { query } = req.body;
  try {
    const response = await fetch("https://api.trieve.ai/api/chunk/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "TR-Organization": process.env.orgId,
        "TR-Dataset": process.env.datasetId,
        Authorization: process.env.apiKey,
      },
      body: JSON.stringify({
        query,
        search_type: "hybrid",
        page_size: 100,
        highlight_results: false,
        get_total_pages: false,
        slim_chunks: true,
        use_weights: true
      }),
    });

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();
    res.status(200).json(data.score_chunks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
