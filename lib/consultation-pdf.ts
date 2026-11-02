import { displayBreedName } from './mixed-breeds';
import { localizeBreedGuidance } from './localize-breed-guidance';
import { translateTrainingText } from './training-text-nb';
import { readBreedGuidance } from './breed-guidance';
import { developmentText, readDevelopment } from './dog-development';
import { actionItems } from './action-items';
import { groupTrainingPlan } from './training-agreement';
import PDFDocument from 'pdfkit';
import path from 'node:path';

export type ConsultationPdfRecord = {
  publication?: { version: number; publishedAt: Date };
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
  dog: { name: string; owner: string; breed: string; age?: string };
};

const translations = {
  en: {
    title: 'Consultation summary', dog: 'Dog', client: 'Client', date: 'Consultation date',
    trainingPlan: 'Actions agreed', actions: 'Recommended actions', plan: 'Actions agreed',
    assessment: 'Initial assessment', health: 'Health', food: 'Food', hormones: 'Hormones',
    activation: 'Activation - current situation', stimulation: 'Stimulation analysis',
    background: 'Background', breed: 'Dog breed', description: 'Description of the situation',
    history: 'Learning history', focus: 'Earlier focus notes', situation: 'Earlier situation notes',
    empty: 'Not recorded', page: 'Page', of: 'of',
    note: 'A summary of the saved consultation record.',
  },
  nb: {
    title: 'Konsultasjonsoppsummering', dog: 'Hund', client: 'Kunde', date: 'Konsultasjonsdato',
    trainingPlan: 'Avtalte tiltak', actions: 'Anbefalte tiltak', plan: 'Avtalte tiltak',
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
      const localText = (value: string) => locale === 'nb' ? translateTrainingText(value) : value;
      const clean = (value: string) => value.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').replace(/[\u2010-\u2015\u2212]/g, '-');
      function ensureSpace(points: number) {
        if (doc.y + points > doc.page.height - doc.page.margins.bottom) doc.addPage();
      }
      function section(title: string) {
        ensureSpace(150);
        doc.moveDown(0.6);
        doc.font('Heading').fontSize(15).fillColor('#12622d').text(title, 48, doc.y, { width });
        doc.moveDown(0.25);
        doc.moveTo(48, doc.y).lineTo(doc.page.width - 48, doc.y).lineWidth(0.6).strokeColor('#cbdccf').stroke();
        doc.moveDown(0.6);
      }
      function field(label: string, value?: string | null, compact = false) {
        ensureSpace(62);
        doc.font('Heading').fontSize(10.5).fillColor('#263d2d').text(label, 48, doc.y, { width });
        doc.moveDown(0.2);
        doc.font('Body').fontSize(10.5).fillColor('#303a33').text(clean(localText(value?.trim() ? value : t.empty)), 48, doc.y, { width, lineGap: compact ? 1 : 3, paragraphGap: compact ? 2 : 4 });
        doc.moveDown(compact ? 0.4 : 0.75);
      }

      function agreement(label: string, value: string) {
        const inset = 16;
        const textWidth = width - inset * 2;
        doc.font('Heading').fontSize(14);
        const headingHeight = doc.heightOfString(label, { width: textWidth });
        doc.font('Body').fontSize(11.5);
        const bodyHeight = doc.heightOfString(clean(value), { width: textWidth, lineGap: 3 });
        const height = inset * 2 + headingHeight + 8 + bodyHeight;
        if (height > doc.page.height - 48 - 58) {
          // Long personalised notes flow across pages without a clipped background.
          section(label);
          doc.font('Body').fontSize(11.5).fillColor('#303a33').text(clean(value), 48, doc.y, { width, lineGap: 3 });
          doc.moveDown(1);
          return;
        }
        ensureSpace(height + 14);
        const top = doc.y;
        doc.roundedRect(48, top, width, height, 8).fill('#eef6ef');
        doc.rect(48, top + 8, 4, height - 16).fill('#12622d');
        doc.font('Heading').fontSize(14).fillColor('#12622d').text(label, 48 + inset, top + inset, { width: textWidth });
        doc.font('Body').fontSize(11.5).fillColor('#263d2d').text(clean(value), 48 + inset, top + inset + headingHeight + 8, { width: textWidth, lineGap: 3 });
        doc.x = 48;
        doc.y = top + height + 14;
      }

      const headerTop = 48;
      const leftWidth = 235;
      const metadataWidth = 235;
      const metadataX = doc.page.width - 48 - metadataWidth;
      doc.image(path.join(process.cwd(), 'public/norsepaw-logo.png'), 34, headerTop - 10, { width: 210 });
      doc.font('Heading').fontSize(23).fillColor('#12622d').text(locale === 'nb' ? 'Oppsummering av\nkonsultasjonen' : t.title, 48, headerTop + 62, { width: leftWidth });
      const titleBottom = doc.y;
      const date = record.date.toLocaleDateString(locale === 'nb' ? 'nb-NO' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Oslo' });
      doc.font('Heading').fontSize(11).fillColor('#263d2d').text(`${t.dog}: ${clean(record.dog.name)}`, metadataX, headerTop, { width: metadataWidth, align: 'right' });
      doc.moveDown(0.35);
      doc.font('Body').fontSize(10).fillColor('#59655d').text(`${t.client}: ${clean(record.dog.owner)}\n${t.date}: ${date}`, metadataX, doc.y, { width: metadataWidth, align: 'right', lineGap: 3 });
      doc.moveDown(0.4);
      const publicationLabel = record.publication
        ? `${locale === 'nb' ? 'Publisert versjon' : 'Published version'} ${record.publication.version}\n${record.publication.publishedAt.toLocaleString(locale === 'nb' ? 'nb-NO' : 'en-GB', { timeZone: 'Europe/Oslo', dateStyle: 'medium', timeStyle: 'short' })} (Oslo)`
        : (locale === 'nb' ? 'Privat utkast — ikke publisert' : 'Private draft — not published');
      doc.font('Heading').fontSize(9).fillColor('#59655d').text(publicationLabel, metadataX, doc.y, { width: metadataWidth, align: 'right', lineGap: 2 });
      const headerBottom = Math.max(titleBottom, doc.y);
      doc.moveTo(48, headerBottom + 18).lineTo(doc.page.width - 48, headerBottom + 18).lineWidth(0.8).strokeColor('#cbdccf').stroke();
      doc.font('Body').fontSize(10).fillColor('#59655d').text(t.note, 48, headerBottom + 30, { width });
      doc.y += 20;
      const groups = groupTrainingPlan(record.prescribedPlan || '');
      if (groups.problem) agreement(locale === 'nb' ? 'Dette ble vi enige om å jobbe med' : 'What we agreed to work on', groups.problem);
      if (groups.goal) agreement(locale === 'nb' ? 'Målet vårt' : 'Our goal', groups.goal);
      const actions = actionItems(record.outcome || '');
      if (actions.length) {
        ensureSpace(62);
        doc.font('Heading').fontSize(10.5).fillColor('#263d2d').text(t.actions, 48, doc.y, { width });
        doc.moveDown(0.25);
        doc.font('Body').fontSize(10.5).fillColor('#303a33').list(actions.map((action) => clean(localText(action))), 48, doc.y, { width, bulletRadius: 2, bulletIndent: 4, textIndent: 12, lineGap: 1, paragraphGap: 2 });
        doc.moveDown(0.5);
      }
      const savedBreedGuidance = readBreedGuidance(record.prescribedPlan || '');
      const breedGuidance = savedBreedGuidance ? localizeBreedGuidance(savedBreedGuidance, locale) : null;
      if (breedGuidance) {
        section(locale === 'nb' ? `Raseveiledning for ${clean(record.dog.name)}` : `Breed guidance for ${clean(record.dog.name)}`);
        const context = locale === 'nb'
          ? `${clean(record.dog.name)} er et individ. Raseinformasjonen er et utgangspunkt. Tilpass rådene til hundens egne preferanser, alder, helse og reaksjoner.`
          : `${clean(record.dog.name)} is an individual. Breed tendencies are a starting point; adapt this guidance to their own preferences, age, health and responses.`;
        doc.font('Body').fontSize(10.5).fillColor('#303a33').text(context, 48, doc.y, { width, lineGap: 1 });
        doc.moveDown(0.5);
        field(locale === 'nb' ? 'Rase' : 'Breed', displayBreedName(breedGuidance.breed, locale), true);
        field(locale === 'nb' ? 'Opprinnelig formål' : 'Original purpose', breedGuidance.purpose, true);
        field(locale === 'nb' ? 'Vanlige trekk' : 'Common traits', breedGuidance.traits, true);
        field(locale === 'nb' ? 'Forslag til aktivisering' : 'Suggested activities', breedGuidance.activation, true);
        field(locale === 'nb' ? 'Temperament' : 'Temperament tendencies', breedGuidance.temperament, true);
        if (breedGuidance.sources.length) {
          ensureSpace(35);
          doc.font('Body').fontSize(8).fillColor('#59655d').text(breedGuidance.sources.map((source) => `${source.title}: ${source.url}`).join('\n'), 48, doc.y, { width, lineGap: 1 });
          doc.moveDown(0.6);
        }
      }
      for (const block of [...groups.training, ...groups.activities]) {
        const [heading, ...lines] = block.split('\n');
        const named = /^(Activity:|Activation:|Starting plan:|Behaviour challenge:|Exercise:)/.test(heading);
        const activity = /^(Activity:|Activation:)/.test(heading);
        const selectedTitle = named ? heading.replace(/^[^:]+:\s*/, '') : heading;
        section(activity ? `${locale === 'nb' ? 'Aktiviseringsøvelse' : 'Activation exercise'}: ${localText(selectedTitle)}` : localText(selectedTitle));
        const body = lines.join('\n').trim();
        if (body) {
          doc.font('Body').fontSize(10.5).fillColor('#303a33').text(clean(localText(body)), 48, doc.y, { width, lineGap: 3, paragraphGap: 4 });
          doc.moveDown(0.75);
        }
      }
      if (!record.prescribedPlan?.trim()) field(locale === 'nb' ? 'Treningsplan' : 'Training plan', record.prescribedPlan);
      section(t.assessment);
      field(t.health, record.health);
      field(t.food, record.nutrition);
      field(t.hormones, record.hormoneAnalysis);
      field(t.activation, record.activation);
      field(t.stimulation, record.stimulusAnalysis);
      section(t.background);
      field(t.breed, displayBreedName(record.dogBreed || record.dog.breed, locale));
      field(locale === 'nb' ? 'Alder og utvikling' : 'Age and development', developmentText(readDevelopment(record.prescribedPlan || ''), locale) || record.dog.age);
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
