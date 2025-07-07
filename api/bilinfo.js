export default async function handler(req, res) {
  const { regnr } = req.query;
  if (!regnr) return res.status(400).json({ error: 'Mangler regnr' });

  try {
    const url = `https://regnr.no/api/regnr/${regnr}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) return res.status(response.status).json({ error: 'Feil ved oppslag' });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Intern feil', detaljer: err.message });
  }
}
