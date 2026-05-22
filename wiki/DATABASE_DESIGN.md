# Database Design

## Initial Core Entities

- User
- Trainer
- Client
- Dog
- Consultation
- BehaviourIncident
- Intervention
- ProgressLog
- Attachment
- Tag

---

# Data Philosophy

Structured data is preferred over unstructured notes.

Capture:
- behaviour category
- severity
- trigger
- intervention
- outcome
- environment
- timestamp

---

# Initial Relationship Ideas

Trainer -> Clients
Client -> Dogs
Dog -> BehaviourIncidents
Dog -> Consultations
Consultation -> Interventions

---

# Notes

Do not over-normalize early.
Keep schema understandable.
Optimize for querying behavioural trends later.
