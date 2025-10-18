'use client';

import { useResumeStore } from '@/store/resume-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';
import type { Certification } from '@/types/resume';

export function CertificationsEditor() {
  const { resumeData, addCertification, updateCertification, deleteCertification } = useResumeStore();
  const { certifications } = resumeData;

  const handleAdd = () => {
    const newCert: Certification = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: '',
      expiryDate: '',
      credentialId: '',
      link: '',
      verified: false,
    };
    addCertification(newCert);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Certifications</h2>
        <Button onClick={handleAdd} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Certification
        </Button>
      </div>

      <div className="space-y-4">
        {certifications.map((cert, index) => (
          <Card key={cert.id} className="p-4 border-2">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">Certification {index + 1}</h3>
                {cert.verified && <CheckCircle2 className="h-4 w-4 text-green-600" />}
              </div>
              <Button variant="destructive" size="sm" onClick={() => deleteCertification(cert.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <Label>Certification Name *</Label>
                <Input
                  value={cert.name}
                  onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                  placeholder="AWS Certified Solutions Architect"
                />
              </div>

              <div>
                <Label>Issuing Organization *</Label>
                <Input
                  value={cert.issuer}
                  onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                  placeholder="Amazon Web Services"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Issue Date *</Label>
                  <Input
                    type="month"
                    value={cert.date}
                    onChange={(e) => updateCertification(cert.id, { date: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Expiry Date (Optional)</Label>
                  <Input
                    type="month"
                    value={cert.expiryDate || ''}
                    onChange={(e) => updateCertification(cert.id, { expiryDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Credential ID (Optional)</Label>
                  <Input
                    value={cert.credentialId || ''}
                    onChange={(e) => updateCertification(cert.id, { credentialId: e.target.value })}
                    placeholder="AWS-SAA-123456"
                  />
                </div>
                <div>
                  <Label>Verification Link (Optional)</Label>
                  <Input
                    value={cert.link || ''}
                    onChange={(e) => updateCertification(cert.id, { link: e.target.value })}
                    placeholder="https://verify.example.com"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id={`verified-${cert.id}`}
                  checked={cert.verified}
                  onChange={(e) => updateCertification(cert.id, { verified: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor={`verified-${cert.id}`} className="text-sm">
                  Mark as verified (show green checkmark)
                </Label>
              </div>
            </div>
          </Card>
        ))}

        {certifications.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No certifications added yet.</p>
            <p className="text-sm">Click "Add Certification" to showcase your credentials.</p>
          </div>
        )}
      </div>
    </Card>
  );
}
