import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { appendHistory } from '@/lib/sheets';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const labels = {
  whatsapp: 'messaggio WhatsApp',
  email: 'email commerciale',
  call: 'script telefonata',
  followup: 'follow-up',
  objection: 'risposta a obiezione',
};

export async function POST(request) {
  try {
    const body = await request.json();
    const typeLabel = labels[body.messageType] || 'messaggio commerciale';

    const prompt = `
Sei un consulente commerciale senior per AppStream.
Devi scrivere un ${typeLabel} in italiano per un potenziale lead.
Tono: morbido, consulenziale, professionale, non aggressivo.
Obiettivo: creare interesse e portare a una breve call/appuntamento conoscitivo.
Non inserire prezzi nel primo contatto.
Firma sempre: ${body.signature || 'Riccardo - AppStream'}.

Dati lead:
- Nome attività: ${body.businessName || 'Non indicato'}
- Settore: ${body.sector || 'Non indicato'}
- Città: ${body.city || 'Non indicata'}
- Sito web: ${body.website || 'Non indicato'}
- Referente: ${body.contactName || 'Non indicato'}
- Servizio da proporre: ${body.service || 'Non indicato'}
- Note: ${body.notes || 'Nessuna'}

Regole:
- Testo concreto, naturale, umano.
- Evita frasi troppo da venditore.
- Non promettere risultati garantiti.
- Per WhatsApp massimo 900 caratteri.
- Per email includi oggetto e corpo.
- Per script telefonata usa punti chiari e brevi.
- Se è risposta a obiezione, rispondi in modo calmo e orientato al prossimo passo.
`;

    const completion = await client.responses.create({
      model: 'gpt-4.1-mini',
      input: prompt,
    });

    const text = completion.output_text || '';

    if (body.saveHistory !== false) {
      await appendHistory({
        leadId: body.leadId || '',
        businessName: body.businessName || '',
        messageType: typeLabel,
        service: body.service || '',
        text,
        signature: body.signature || 'Riccardo - AppStream',
      });
    }

    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
