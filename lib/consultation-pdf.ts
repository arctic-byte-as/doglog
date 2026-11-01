import PDFDocument from 'pdfkit';
import path from 'node:path';

export type ConsultationPdfRecord = {
  date: Date;
  outcome: string;
  prescribedPlan?: string | null;
  health?: string | null;
  nutrition?: string | null;
  hormoneAnalysis?: string | null;
  activation?: string | null;
  stimulusAnalysis?: string | null;
  generalDescription?: string | null;
  dogBreed?: string | null;
  learningHistory?: string | null;
  focus?: string | null;
  situation?: string | null;
  dog: { name: string; owner: string; breed: string };
};

const translations = {
  en: {
    title: 'Consultation summary', dog: 'Dog', client: 'Client', date: 'Consultation date',
    trainingPlan: 'Training plan', actions: 'Recommended actions', plan: 'Prescribed training plan',
    assessment: 'Initial assessment', health: 'Health', food: 'Food', hormones: 'Hormones',
    activation: 'Activation - current situation', stimulation: 'Stimulation analysis',
    background: 'Background', breed: 'Dog breed', description: 'Description of the situation',
    history: 'Learning history', focus: 'Earlier focus notes', situation: 'Earlier situation notes',
    empty: 'Not recorded', page: 'Page', of: 'of',
    note: 'A summary of the saved consultation record.',
  },
  nb: {
    title: 'Konsultasjonsoppsummering', dog: 'Hund', client: 'Kunde', date: 'Konsultasjonsdato',
    trainingPlan: 'Treningsplan', actions: 'Anbefalte tiltak', plan: 'Anbefalt treningsplan',
    assessment: 'Innledende vurdering', health: 'Helse', food: 'Mat', hormones: 'Hormoner',
    activation: 'Aktivisering - nåværende situasjon', stimulation: 'Stimuleringsanalyse',
    background: 'Bakgrunn', breed: 'Hunderase', description: 'Beskrivelse av situasjonen',
    history: 'Læringshistorikk', focus: 'Tidligere fokusnotater', situation: 'Tidligere situasjonsnotater',
    empty: 'Ikke registrert', page: 'Side', of: 'av',
    note: 'En oppsummering av den lagrede konsultasjonen.',
  },
};

export function createConsultationPdf(record: ConsultationPdfRecord, locale: 'en' | 'nb' = 'en'): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const t = translations[locale];
    const regular = path.join(process.cwd(), 'assets/fonts/pdf/NotoSans-Regular.ttf');
    const bold = path.join(process.cwd(), 'assets/fonts/pdf/NotoSans-Bold.ttf');
    const doc = new PDFDocument({
      size: 'A4', margins: { top: 48, bottom: 58, left: 48, right: 48 },
      bufferPages: true, font: regular,
      info: { Title: `${t.title} - ${record.dog.name}`, Author: 'Norse Paw', Subject: t.title },
      lang: locale === 'nb' ? 'nb-NO' : 'en-GB',
    });
    const chunks: Buffer[] = [];
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    try {
      doc.registerFont('Body', regular).registerFont('Heading', bold);
      const width = doc.page.width - 96;
      const clean = (value: string) => value.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').replace(/[\u2010-\u2015\u2212]/g, '-');
      function ensureSpace(points: number) {
        if (doc.y + points > doc.page.height - doc.page.margins.bottom) doc.addPage();
      }
      function section(title: string) {
        ensureSpace(100);
        doc.moveDown(0.6);
        doc.font('Heading').fontSize(15).fillColor('#12622d').text(title, 48, doc.y, { width });
        doc.moveDown(0.25);
        doc.moveTo(48, doc.y).lineTo(doc.page.width - 48, doc.y).lineWidth(0.6).strokeColor('#cbdccf').stroke();
        doc.moveDown(0.6);
      }
      function field(label: string, value?: string | null) {
        ensureSpace(62);
        doc.font('Heading').fontSize(10.5).fillColor('#263d2d').text(label, 48, doc.y, { width });
        doc.moveDown(0.2);
        doc.font('Body').fontSize(10.5).fillColor('#303a33').text(clean(value?.trim() ? value : t.empty), 48, doc.y, { width, lineGap: 3, paragraphGap: 4 });
        doc.moveDown(0.75);
      }

      doc.font('Heading').fontSize(12).fillColor('#12622d').text('NORSE PAW');
      doc.moveDown(0.6);
      doc.fontSize(23).text(t.title, { width });
      doc.moveDown(0.35);
      doc.font('Body').fontSize(10).fillColor('#59655d').text(t.note, { width });
      doc.moveDown(0.7);
      const date = record.date.toLocaleDateString(locale === 'nb' ? 'nb-NO' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Oslo' });
      doc.font('Heading').fontSize(11).fillColor('#263d2d').text(`${t.dog}: ${clean(record.dog.name)}`, { width });
      doc.font('Body').text(`${t.client}: ${clean(record.dog.owner)}\n${t.date}: ${date}`, { width, lineGap: 3 });
      section(t.trainingPlan);
      field(t.actions, record.outcome);
      field(t.plan, record.prescribedPlan);
      section(t.assessment);
      field(t.health, record.health);
      field(t.food, record.nutrition);
      field(t.hormones, record.hormoneAnalysis);
      field(t.activation, record.activation);
      field(t.stimulation, record.stimulusAnalysis);
      section(t.background);
      field(t.breed, record.dogBreed || record.dog.breed);
      field(t.description, record.generalDescription);
      field(t.history, record.learningHistory);
      if (record.focus?.trim()) field(t.focus, record.focus);
      if (record.situation?.trim()) field(t.situation, record.situation);

      const pages = doc.bufferedPageRange();
      for (let index = pages.start; index < pages.start + pages.count; index++) {
        doc.switchToPage(index);
        // Footer sits below the content margin; temporarily allow text there without adding a page.
        const bottom = doc.page.margins.bottom;
        doc.page.margins.bottom = 0;
        doc.font('Body').fontSize(8).fillColor('#59655d').text(`Norse Paw  |  ${t.page} ${index + 1} ${t.of} ${pages.count}`, 48, doc.page.height - 34, { width, align: 'right', lineBreak: false });
        doc.page.margins.bottom = bottom;
      }
      doc.end();
    } catch (error) {
      doc.destroy();
      reject(error);
    }
  });
}
