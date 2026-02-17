# SortOut Jobs Frontend — TODO

Done = check | Not done = leave blank

---

## Auth Integration (Backend: sortout-backend)

| Done | Task |
|:---:|------|
| x | Update .env to point to backend (localhost:8000) |
| x | Update api.js (base URL, refresh interceptor) |
| x | Update auth.service.js (endpoint paths, field names) |
| x | Update AuthContext.jsx (parse user object from backend response) |
| x | Update PhoneLoginForm.jsx (otp→code field name, isNewUser heuristic) |
| x | Update AdminLoginForm.jsx (role check for backend lowercase roles) |
| x | Update AdminRoute.jsx (case-insensitive role check) |
| x | Update README.md with backend connection docs |

---

## Onboarding Integration (Future)

| Done | Task |
|:---:|------|
| | Connect onboarding.service.js to backend onboarding endpoints |
| | Update onboarding flow to use backend user object |

---

## Profile Integration (Future)

| Done | Task |
|:---:|------|
| | Connect profile.service.js to backend profile endpoints |
| | Update profile components to use backend user object |

---

## Job Listings Integration (Future)

| Done | Task |
|:---:|------|
| | Connect job.service.js to backend job endpoints |
| | Update job components to use backend data |

---

## Admin Integration (Future)

| Done | Task |
|:---:|------|
| | Connect admin.service.js to backend admin endpoints |
| | Update admin components to use backend data |
