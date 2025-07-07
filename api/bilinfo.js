export default async function handler(req, res) {
  const { regnr } = req.query;
  if (!regnr) return res.status(400).json({ error: 'Mangler registreringsnummer' });

  try {
    const url = `https://www.biluppgifter.se/api/vehicle/info?registrationNumber=${regnr}&country=NO`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0', // viktig
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Oppslag feilet', status: response.status });
    }

    const html = await response.text();

    // Hent ut merke og modell fra HTML (enkel scraping)
    const merkeMatch = html.match(/"make":"(.*?)"/);
    const modellMatch = html.match(/"model":"(.*?)"/);

    const data = {
      merke: merkeMatch ? merkeMatch[1] : 'Ukjent',
      modell: modellMatch ? modellMatch[1] : 'Ukjent'
    };

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Intern serverfeil', detaljer: err.message });
  }
}
