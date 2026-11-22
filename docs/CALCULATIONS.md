# Operational & Financial Calculations (Planned)

> **Source of Truth:** Derived from [implementation_plan.md](../implementation_plan.md).
> **Status:** Specification only. Calculation services are **not implemented in Phase 1**.

All operational and financial aggregates are **record-derived** directly from normalized PostgreSQL rows—never stored as manually incremented counters.

## 1. Flock Age & Population Math

- **Flock Age on Date $D$:**
  $$\text{weeks} = \text{starting\_age\_weeks} + \left\lfloor \frac{D - \text{placement\_date}}{7} \right\rfloor, \quad \text{days} = (D - \text{placement\_date}) \bmod 7$$
  Displayed as `Week X + Yd`.

- **Opening Live Hens / Roosters on Date $D$:**
  $$\text{opening\_live\_birds}(D) = \text{initial\_count} - \sum \text{mortality strictly before } D$$
  Computed separately for hens and roosters.

## 2. Mortality Percentages

- **Daily Mortality %:**
  $$\text{Daily Mortality \%} = \frac{\text{daily\_deaths}}{\text{opening\_live\_birds}} \times 100$$
  Computed separately for hens, roosters, and total. Omitted / marked `N/A` when denominator is `0`.

- **Cumulative Mortality %:**
  $$\text{Cumulative Mortality \%} = \frac{\text{cumulative\_deaths}}{\text{initial\_birds}} \times 100$$
  Cumulative mortality is constrained never to exceed `initial_birds`.

## 3. Egg Production Metrics

- **Total Eggs:**
  $$\text{total\_eggs} = \text{hatching\_eggs} + \text{commercial\_eggs} + \text{reject\_eggs}$$

- **Hatching Egg % (HEP):**
  $$\text{HEP \%} = \frac{\text{hatching\_eggs}}{\text{total\_eggs}} \times 100$$

- **Hen-Day Egg Production % (HDEP):**
  $$\text{HDEP \%} = \frac{\text{total\_eggs}}{\text{opening\_live\_hens}} \times 100$$

## 4. Feed Consumption Isolation

- **Total Feed (Bags):** `SUM(quantity)` where `unit = 'bags'`
- **Total Feed (Kilograms):** `SUM(quantity)` where `unit = 'kg'`
- `bags` and `kg` are **never** automatically converted or summed together.

## 5. Financial Arithmetic (INR ₹)

- Stored in PostgreSQL as `NUMERIC(12, 2)` and computed in TypeScript using **exact integer-paise arithmetic** ($1\text{ INR} = 100\text{ paise}$) to avoid IEEE-754 floating-point drift.
- **Outstanding Liability:** Derived strictly from active obligations (`expenses` / `salary_records` where `status = 'active'`) minus non-reversed linked `payments` (`is_reversed = false`).
- **Payment Reversal:** Marks a payment `is_reversed = true` with `reversal_reason`, restoring the outstanding balance without inflating expense totals.
