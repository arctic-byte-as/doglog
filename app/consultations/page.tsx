import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import { consultations } from '@/lib/mock-data';
import ConsultationItem from '@/components/ConsultationItem';
import CreateConsultationForm from '@/components/CreateConsultationForm';

export default function ConsultationsPage() {
  return (
    <SiteShell>
      <div className="space-y-8">
        <SectionCard title="Consultation log">
          <CreateConsultationForm />
          <div className="space-y-4">
            {consultations.map((item) => (
              <ConsultationItem key={item.id} consultation={item} />
            ))}
          </div>
        </SectionCard>
      </div>
    </SiteShell>
  );
}
