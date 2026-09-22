# UK Residential Construction Estimating Software & Builders Costing Excel Template

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Platform](https://img.shields.io/badge/Platform-Browser%20(Free)%20%7C%20Excel%20(Paid)-emerald.svg)](#)
[![Tool Type](https://img.shields.io/badge/Tool%20Type-Decision%20Support%20%7C%20Costing%20Engine-orange.svg)](#)

**An advanced UK residential construction estimating template and building project costing software designed to turn measured architectural drawing quantities into contractor-specific tender budgets, internal commercial bottom-lines, and clean client quotations in seconds. Available as a free browser-based construction quoting tool and a fully unlocked professional Excel estimating workbook for builders, backed by a 30-day money-back guarantee.**

> **No signup. No installation.**  
> **Browser version: Free.**  
> **Excel version: Paid with a 30-day money-back guarantee.**  
> [🌐 Open the Free Browser-Based Construction Estimating App](https://hyvoid.github.io/uk-residential-costing-software/)
>
> [📥 Download the Professional Builders Estimating Excel Template](https://theseusworkshop.com/l/arnghy?utm_source=github&utm_medium=GitHub%20README)

<img width="1920" height="828" alt="image" src="https://github.com/user-attachments/assets/6d58eaae-fcd8-4407-8678-25f5f3067d57" />
<img width="1163" height="790" alt="image" src="https://github.com/user-attachments/assets/b156ab36-5886-40cb-879d-fbadbbf32a7a" />


---

## Core Features: Construction Cost Tracking & Tender Management Solutions

Traditional spreadsheets fail because they mix quantities with pricing. This system acts as a true **bill of quantities (BOQ) pricing engine**, explicitly designed to resolve the most expensive errors in construction estimating.

| Construction Estimating Pain Point (Search Query) | Automated Solution in Costing Engine |
| :--- | :--- |
| **Contractor Markup vs. Operating Loss Tracking** | Separates direct trade costs, site preliminaries, statutory overhead, and contingency from contractor markup so bidding margins never collapse into operating losses. |
| **Subcontractor Pricing & Rate Variance Analysis** | Evaluates how swapping trade partners (e.g., local Hertfordshire builders vs. regional subcontractors) instantly changes baseline project profitability on the exact same physical BOQ. |
| **Direct Cost Breakdown (Labour & Materials)** | Provides exact line-item splits across Labour, Materials, Specialist Subcontractors, and Plant Hire for every structural and architectural stage. |
| **Material Waste Calculation for Construction** | Dynamically calculates purchase volume escalations at the item level (e.g., facing brick cutting waste) rather than masking them with uniform rule-of-thumb allowances. |
| **Client-Facing Pricing vs. Internal Margins** | Automatically generates a desensitized client tender schedule that absorbs overhead and preliminaries smoothly into blended item unit prices without exposing trade subcontractor costs or target gross margins. |
| **Tender Integrity & BOQ Reconciliation** | Delivers real-time validation confirming zero unregistered item codes, missing trade rates, or formula disconnections, ensuring strict balance between internal cost models and client totals within £0.01 tolerance. |

---

## Quick Start Tutorial: Build Your First Construction Tender

Follow this workflow to generate accurate estimates and client-ready quotations using our built-in commercial costing features.

1. **Set Key Parameters (Project Setup)**: Open `01_Setup` to configure project metadata. Utilize the **dynamic contractor dropdown** to select your active bidding partner, establish currency display (£), and confirm global targets for the **Preliminaries mode**, Overhead & Profit (OHP %), Contingency %, and statutory VAT.
2. **Input Physical Quantities (Takeoff Import)**: Open `04_Project_Estimate` and enter architectural drawing takeoff codes (`Takeoff_Item_Code`) alongside physical measured quantities (`Measured_Quantity`). The engine instantly matches **trade pricing matrices** from the central library without manual formula dragging.
3. **Capture Site Logistics & Allowances**: Enter non-standard site commitments (e.g., scaffolding duration, waste skip hire, welfare setups) and client provisional sums (e.g., kitchen packages, sanitaryware allowances) in the `05_Adjustments` **site prelims calculator**.
4. **Inspect Decision Views & Export**: Review internal margin hurdles and breakeven floors in `06_Internal_Estimate`, verify zero red-flag audits in `08_Checks`, and export the desensitized, client-ready quotation schedule from `07_Customer_Estimate` straight to PDF. 

> **Ready to scale your quoting process?** After trying the browser version, [📥 Download the reusable Excel estimating template for unlimited tenders and lifetime offline access](https://theseusworkshop.com/l/arnghy?utm_source=github&utm_medium=GitHub%20README).

---

## Why I Built This Costing Software

Most domestic and mid-market residential estimates (£100k–£500k) fail long before ground is broken. They fail because small-to-medium builders and project managers rely on monolithic **construction estimating spreadsheets** where trade pricing, site logistics, material waste, and physical quantities are welded into a single cell. When a principal contractor receives updated subcontractor rates or needs to submit a tender using an alternative framing crew, the entire BOQ must be rebuilt by hand.

In a recent £260,000 double-storey extension estimate, the lead builder applied a customary 15% flat markup to a composite square-meter brickwork rate. However, the site had restricted rear alley access requiring small-plant haulage, and bespoke facing bricks carried a 10% cutting waste factor instead of the standard 5%. Because the rate was a hardcoded composite number, the extra £4,200 in brick overage and £3,800 in extended plant hire were never attributed to the job base. The bid looked competitive, but upon completion, the contractor achieved a 3.4% net margin instead of the targeted 16% — completely eliminating operating cash flow.

I built this **construction estimating engine** to eliminate that failure mode forever. Instead of treating an estimate as a static arithmetic canvas, this tool productizes commercial cost engineering: separating the immutable physical geometry of a building from volatile trade labor rates, isolating site preliminaries, and dynamically cascading commercial markups across customer deliverables.

---

## Common Residential Estimating Problems This Tool Solves

| Estimating & Costing Problem | Traditional Spreadsheet Limitations | Automated Costing Engine Solution |
| :--- | :--- | :--- |
| **Coupled Quantities and Labor Pricing** | Re-quoting a tender with a new subcontractor requires re-entering project dimensions and copying formulas across dozens of BOQ rows. | Physical takeoff quantities remain untouched; switching the contractor dropdown in `01_Setup` re-indexes all labour, plant, and material rates in under one second. |
| **Silent Material Waste Underestimation** | Flat percentage allowances applied to overall sums fail to cover cutting waste on high-value masonry, tiles, and structural timber. | Item-specific tiered logic applies dedicated waste parameters to procurement quantities before pricing occurs, ensuring accurate **takeoff estimates**. |
| **Preliminary Cost Concession Leakage** | Scaffolding, skip hire, and project management are listed as transparent lump sums, which clients routinely negotiate away during contract review. | Preliminaries and business overheads are mathematically absorbed into blended client item rates, ensuring overhead recovery is protected inside binding unit rates. |
| **Formula Drift & Broken References** | Adding unexpected structural items requires manual row insertion and formula dragging, frequently leaving rows excluded from totals. | Modern single-point dynamic spill arrays automatically ingest new lines and push sums across all analytical worksheets for bulletproof **job costing**. |
| **Client Exposure of Commercial Bottom-Lines** | Estimators spend hours manually sanitizing internal calculation spreadsheets into client quotes, risking accidental disclosure of trade margins. | A completely decoupled client-facing sheet reads from the central engine, displaying clean work sections while completely hiding internal trade rates and profit margins. |

---

## Target Users & Specific Estimating Scenarios

This template acts as a lightweight ERP for construction professionals handling residential contracts. 

- **Residential Builders & Main Contractors (£100k–£500k)**: General builders using this **estimating software for home extensions**, full-home refurbishments, and **loft conversion costing templates** to secure defensible internal margins before signing fixed-price JCT contracts.
- **Quantity Surveyors & Estimating Consultants**: Professionals managing multiple subcontractor rate files who need a scalable **BOQ pricing template** and repeatable **tender schedule Excel workbook** without maintaining fragile, complex enterprise infrastructure.
- **Property Developers & Self-Builders**: Operators seeking a transparent **house building cost calculator** and a bottom-up benchmark tool to cross-examine contractor tender packages and identify loaded trade items.

*Not designed for*: Commercial high-rise civil engineering projects requiring full SMM7/NRM2 consultant bills of quantities, enterprise multi-user ERP accounting, or direct automated CAD/BIM polygon extraction.

No spreadsheet expertise needed. Open the free browser app and start estimating immediately. Need the robust desktop version? [Buy the Professional Excel Estimating Template with a 30-day money-back guarantee](https://theseusworkshop.com/l/arnghy?utm_source=github&utm_medium=GitHub%20README).

---

## About The Developer

I build productized decision-support tools and lightweight operational models for environments where there are simply too many moving parts to manage by intuition. In residential construction, single-point estimating oversights compound into structural cash-flow failures. My work focuses on answering one fundamental question: *"What information do I need in one clear place to make the next commercial decision with absolute confidence?"* The **UK Residential Construction Estimating Engine** is an exact realization of this approach.

---


## Technical Details

<details>
<summary>For technical reviewers, Excel practitioners, and collaborators</summary>

### Workbook Architecture

The system operates across four distinct functional layers across eight worksheets. Data flows strictly in one direction (Configuration $\rightarrow$ Master Data $\rightarrow$ Calculation $\rightarrow$ Output), eliminating circular references and safeguarding data integrity:

```
[01_Setup] (Global Parameters & Contractor Switcher)
   │
   ├── Controls currency, contractor selection, waste defaults, prelims mode, and margin targets
   ▼
[02_Item_Master] ─────────────▶ [03_Rate_Library]
(WBS Taxonomy & Descriptions)    (Subcontractor Rate Matrix: Labour / Material / Plant)
   │                               │
   └──────────────┬────────────────┘
                  ▼
       [04_Project_Estimate] ◀────── [05_Adjustments]
       (Dynamic Calculation Engine)   (Prelims, Provisional Sums, Site Allowances)
                  │
         ┌────────┴────────────────────────┐
         ▼                                 ▼
[06_Internal_Estimate]           [07_Customer_Estimate]
(Detailed Commercial Bottom-Line) (Clean Desensitized Client Tender)
         │                                 │
         └────────────────┬────────────────┘
                          ▼
                     [08_Checks]
         (Data Integrity, Code Mapping, Margin Audit)
```

| Layer | Worksheet Name | Operational Responsibility | Input / Formula Type |
| :--- | :--- | :--- | :--- |
| **01. Control** | `01_Setup` | Holds all global configuration variables, company metadata, target margins, and contractor dropdown triggers. | User Inputs & Dynamic Lists |
| **02. Master Data** | `02_Item_Master` | Establishes the standard WBS, trade codes (`GW`, `MAS`, `CAR`, etc.), units of measure, and default material waste. | Master Taxonomy (Static / Append) |
| **02. Master Data** | `03_Rate_Library` | Maintains multi-contractor cost vectors across Labour, Material, Subcontract, and Plant. | Relational Pricing Tables |
| **03. Calculation** | `04_Project_Estimate` | Primary workspace. Ingests takeoff quantities, evaluates effective waste, matches contractor rates, and aggregates direct cost lines. | Single-Point Dynamic Spill Arrays |
| **03. Calculation** | `05_Adjustments` | Isolates site preliminaries, scaffold/skip durations, and client provisional allowances. | Structured Item Schedules |
| **04. Reporting** | `06_Internal_Estimate` | Builds complete commercial waterfall: Direct Costs + Prelims = Prime Cost $\rightarrow$ OHP $\rightarrow$ Contingency $\rightarrow$ Breakeven. | Dynamic Section Aggregation |
| **04. Reporting** | `07_Customer_Estimate` | Synthesizes an auditable, desensitized client quote schedule, blending overheads into item rates. | Desensitized Spill Arrays |
| **04. Governance** | `08_Checks` | Runs continuous 6-point data integrity, unmapped code detection, missing rate alerts, and trial balance reconciliation. | Automated Boolean & Variance Audits |

---

### Three Traps That Catch Even Experienced Estimators

#### Trap 1: Blended Subcontractor Rate Compression
1. **Decision Made**: An estimator applies an aggregate historical rate of £85.00/m² to a 140m² blockwork and brickwork package, assuming labor and materials will average out based on a previous job.
2. **The Unnoticed Fault**: The project uses specialized handmade water-struck facing bricks (£1,150/1,000 bricks) rather than standard engineering bricks (£450/1,000 bricks), while the site is down an unpaved narrow lane requiring manual hod-carrying.
3. **Flaw Impact**: The actual material cost jumps to £62.00/m² and labor climbs to £48.00/m², totaling £110.00/m² direct cost.
4. **Why Reasoning Is Flawed**: Aggregated rates obscure shifts in resource ratios. Masonry is rarely a 50/50 split; material inflation and site logistics decouple labor and procurement velocity.
5. **Corrected Approach**: Unbundle direct costs into four distinct vectors (Labour, Material, Subcontract, Plant) linked directly to the specific contractor's rate library.
6. **Corrected Outcome**: The true cost is flagged at £110.00/m² direct cost, pricing the line at £15,400 instead of £11,900, protecting £3,500 of net cash.

<details>
<summary>View Multi-Vector Rate Matching Logic</summary>

```excel
=LET(
    target_contractor, '01_Setup'!$C$5,
    input_codes, A4:A500,
    rate_contractors, '03_Rate_Library'!A4:A1000,
    rate_codes, '03_Rate_Library'!B4:B1000,
    rate_matrix, '03_Rate_Library'!D4:G1000,
    composite_keys, rate_contractors & "|" & rate_codes,
    lookup_keys, target_contractor & "|" & input_codes,
    IF(input_codes="", "", 
        XLOOKUP(lookup_keys, composite_keys, rate_matrix, 0, 0)
    )
)
```
</details>

---

#### Trap 2: Uncompounded Waste on Net Quantities
1. **Decision Made**: For a ground-floor slab and cavity wall, the estimator measures 100m² of floor tiling and 80m² of facing brickwork from the CAD drawing, applying a standard 5% overall budget contingency at tender summary.
2. **The Unnoticed Fault**: Diagonal tile patterns on an L-shaped room generate 12% offcut waste; facing bricks around staggered openings yield 8% waste.
3. **Flaw Impact**: The contractor under-orders materials by 7m² of tile and 6.4m² of masonry, forcing emergency replenishment at premium short-batch prices and halting tile setters for three days.
4. **Why Reasoning Is Flawed**: Waste is physical geometry, not commercial financial contingency. Financial contingency cannot replenish missing pallets of batch-matched tiles.
5. **Corrected Approach**: Calculate net procurement volume prior to unit pricing using a tiered hierarchy: Manual Override % $>$ Master Item Baseline % $>$ Global Default %.
6. **Corrected Outcome**: Procurement volumes accurately scale to 112m² for tiles and 86.4m² for bricks, eliminating emergency freight and site downtime.

<details>
<summary>View Effective Waste Determination Logic</summary>

```excel
=LET(
    codes, A4:A500,
    manual_waste, G4:G500,
    master_codes, '02_Item_Master'!A4:A500,
    master_waste, '02_Item_Master'!F4:F500,
    global_default, '01_Setup'!$C$6,
    looked_up_waste, XLOOKUP(codes, master_codes, master_waste, global_default, 0),
    IF(codes="", "", 
        IF(manual_waste<>"", manual_waste, 
            IF(looked_up_waste<>"", looked_up_waste, global_default)
        )
    )
)
```
</details>

---

#### Trap 3: Transparent Preliminary Items Negotiated Away by Clients
1. **Decision Made**: The contractor includes scaffolding (£6,500), temporary toilet/site welfare (£1,800), and site supervisor management (£9,000) as explicit line items on the client quotation.
2. **The Unnoticed Fault**: The client argues: *"I don't want to pay £1,800 for a portaloo and your scaffolding quote is higher than my friend paid; take those lines off or I'll find another builder."*
3. **Flaw Impact**: To secure the contract, the contractor strikes £8,300 of preliminaries from the contract, intending to "absorb it into general profits."
4. **Why Reasoning Is Flawed**: Site preliminaries are rigid direct operating expenses, not discretionary markup. Striking the line does not reduce site welfare or scaffold hire costs.
5. **Corrected Approach**: Maintain absolute internal visibility of preliminaries in `05_Adjustments` and `06_Internal_Estimate`, but dynamically absorb them into the client-facing schedule via proportional markup distribution across physical work sections.
6. **Corrected Outcome**: The client receives a clean schedule of work with all preliminaries and overheads mathematically embedded into trade unit rates, making logistics non-negotiable.

<details>
<summary>View Proportional Markup Absorption Logic</summary>

```excel
=LET(
    codes, '04_Project_Estimate'!A4:A500,
    base_rates, '04_Project_Estimate'!P4:P500,
    direct_total, '06_Internal_Estimate'!$C$22,
    internal_gross, '06_Internal_Estimate'!$C$28,
    ps_total, '06_Internal_Estimate'!$C$27,
    markup_factor, IF(direct_total>0, (internal_gross - ps_total) / direct_total, 1),
    filtered_rates, FILTER(base_rates, codes<>""),
    filtered_rates * markup_factor
)
```
</details>

---

### Example Scenario: Hertfordshire Extension & Loft Conversion

#### 1. Raw Inputs (`01_Setup` & `04_Project_Estimate`)
- **Project**: 45m² Ground-Floor Wrap-Around Extension + Rear Dormer Loft Conversion.
- **Contractor Selected**: `Apex_Builders_Herts`
- **Global Parameters**: Default Waste = 5.0%, Prelims Mode = Fixed (`05_Adjustments`), OHP = 15.0%, Contingency = 5.0%, VAT = 20.0%.
- **Key Measured Takeoffs**:
  - `GW-001` (Strip foundation excavation): $24.0\,\text{m}^3$
  - `GW-002` (Ready-mix concrete C20/25 poured): $16.5\,\text{m}^3$ (Standard waste 5.0%)
  - `MAS-001` (Facing brickwork 102.5mm skin): $68.0\,\text{m}^2$ (Manual override waste: 8.0%)
  - `STL-001` (Structural Steel Universal Beams fabricated & hoisted): $1.85\,\text{t}$
  - `ROO-001` (Concrete interlocking roof tiles): $52.0\,\text{m}^2$ (Standard waste 8.0%)
- **Adjustments Entered (`05_Adjustments`)**:
  - Independent Scaffolding (10-week rental): £4,800.00
  - Site Waste Clearance (4x 8-yard skips): £1,440.00
  - Temporary Site Welfare & Secure Storage: £1,250.00
  - Provisional Sum (Kitchen cabinetry & appliances allowance): £20,000.00

#### 2. Intermediate Engine Calculations (`04_Project_Estimate`)
- `MAS-001` Net Calculated Qty: $68.0 \times (1 + 0.08) = 73.44\,\text{m}^2$
- `MAS-001` Contractor Rates: Labour £42.00, Material £48.50, Subcontract £0.00, Plant £4.50 $\rightarrow$ Composite Rate = £95.00/m²
- `MAS-001` Direct Line Cost: $73.44\,\text{m}^2 \times £95.00 = £6,976.80$
- Aggregated Project Direct Costs ($\sum \text{Direct Cost}$ across all trades): **£112,450.00**

#### 3. Commercial Waterfall (`06_Internal_Estimate`)
$$\begin{aligned}
\text{Total Direct Cost} &= £112,450.00 \\
\text{Total Preliminaries} &= £7,490.00 \\
\hline
\mathbf{\text{Prime Cost}} &= £119,940.00 \\
\text{Overhead \& Profit (15.0\% on Prime)} &= £17,991.00 \\
\text{Contingency (5.0\% on Prime)} &= £5,997.00 \\
\text{Provisional Sums} &= £20,000.00 \\
\hline
\mathbf{\text{Gross Internal Contract Sum (Net of VAT)}} &= \mathbf{£163,928.00} \\
\text{Breakeven Floor (Direct + Prelims)} &= £119,940.00 \\
\text{Project Target Gross Margin} &= \frac{£163,928 - £119,940}{£163,928} = \mathbf{26.83\%} \quad (\text{includes Provisional Sums})
\end{aligned}$$

#### 4. Analytical Interpretation & Recommendation
- **Markup Multiplier**: Proportional absorption factor applied to client items:
  $$\text{Markup Factor} = \frac{£163,928 - £20,000}{£112,450} = 1.27993$$
- **Client Facing Translation**: The client sees `MAS-001` priced at $£95.00 \times 1.27993 = \mathbf{£121.59/\text{m}^2}$, yielding a line sum of £8,929.57.
- **Decision Outcome**: The builder tenders at **£163,928.00 + VAT (£196,713.60 gross)**. Zero individual preliminary items are exposed to line-by-line client cross-examination, and the company’s £23,988 commercial cushion (OHP + Contingency) remains protected.

---

### Formula Reference

<details>
<summary>01_Setup: Dynamic Contractor Indexing</summary>

```excel
=SORT(UNIQUE(FILTER('03_Rate_Library'!A4:A500, '03_Rate_Library'!A4:A500<>"")))
```
*Purpose*: Extracts a sorted, unique vector of active contractors from the rate matrix to populate cell `$C$5` data validation dynamically.
</details>

<details>
<summary>04_Project_Estimate: Direct Cost Full-Vector Multiplication</summary>

```excel
=LET(
    codes, A4:A500,
    net_qty, I4:I500,
    labour_r, J4:J500,
    mat_r, K4:K500,
    subc_r, L4:L500,
    plant_r, M4:M500,
    tot_rate, P4:P500,
    IF(codes="", "",
        HSTACK(
            net_qty * labour_r,
            net_qty * mat_r,
            net_qty * subc_r,
            net_qty * plant_r,
            net_qty * tot_rate
        )
    )
)
```
*Purpose*: Executes horizontal 5-column spill (Q through U) multiplying net quantities by four-way cost vectors and composite rates simultaneously.
</details>

<details>
<summary>06_Internal_Estimate: Dynamic Work Section Aggregation</summary>

```excel
=LET(
    active_sections, SORT(UNIQUE(FILTER('04_Project_Estimate'!D4:D500, '04_Project_Estimate'!D4:D500<>""))),
    labour_col, SUMIFS('04_Project_Estimate'!Q$4:Q$500, '04_Project_Estimate'!$D$4:$D$500, active_sections),
    mat_col, SUMIFS('04_Project_Estimate'!R$4:R$500, '04_Project_Estimate'!$D$4:$D$500, active_sections),
    subc_col, SUMIFS('04_Project_Estimate'!S$4:S$500, '04_Project_Estimate'!$D$4:$D$500, active_sections),
    plant_col, SUMIFS('04_Project_Estimate'!T$4:T$500, '04_Project_Estimate'!$D$4:$D$500, active_sections),
    total_col, labour_col + mat_col + subc_col + plant_col,
    HSTACK(active_sections, labour_col, mat_col, subc_col, plant_col, total_col)
)
```
*Purpose*: Groups all project direct expenses by their respective construction trades dynamically without requiring preset rows.
</details>

<details>
<summary>08_Checks: Mathematical Balance Reconciliation</summary>

```excel
=LET(
    customer_net, SUM('07_Customer_Estimate'!F4:F500) + '06_Internal_Estimate'!$C$27,
    internal_gross, '06_Internal_Estimate'!$C$28,
    tolerance, '01_Setup'!$C$12,
    IF(ABS(customer_net - internal_gross) <= tolerance, 
        "✅ PASS: Trial balance reconciled within tolerance", 
        "❌ FAIL: Imbalance detected [" & TEXT(customer_net - internal_gross, "£#,##0.00") & "]"
    )
)
```
*Purpose*: Performs strict trial balance verification between customer-facing tenders and internal bottom-line costs.
</details>

---

### Validation Rules

| Worksheet | Cell / Range | Rule Target | Validation Rule | Error Behavior |
| :--- | :--- | :--- | :--- | :--- |
| `01_Setup` | `$C$5` | Active Contractor | Dropdown list bound to `='01_Setup'!$F$4#` | Rejects unregistered contractor names. |
| `01_Setup` | `$C$6:$C$11` | Financial Percentages | Number validation: $\ge 0.0\%$ and $\le 100.0\%$ | Prevents negative or mathematically catastrophic tax/markup inputs. |
| `02_Item_Master` | `A4:A500` | Master Item Code | Unique text string; duplicates audited in `08_Checks` | Flags warning in governance board if master key is duplicated. |
| `04_Project_Estimate` | `A4:A500` | Takeoff Item Code | Must exist in `02_Item_Master!A4:A500` | Displays `"⚠️ Unregistered Code"` in description and triggers audit failure in `08_Checks`. |
| `04_Project_Estimate` | `B4:B500` | Measured Quantity | Numeric value $\ge 0$ | Formula suppresses calculations if quantity is omitted or non-numeric. |
| `04_Project_Estimate` | `N4:N500` | Rate Override | Numeric value $> 0$ | Requires mandatory explanation text in column O (`Override_Reason`). |
| `08_Checks` | `$C$9` | Model Balance Check | $| \text{Customer Net} - \text{Internal Gross} | \le 0.01$ | Displays prominent red flag: `"❌ FAIL: Imbalance detected"`. |

</details>

---


## The Business Logic & Methodology

This system relies on **three-tier unit economics decomposition** paired with a **proportional absorption costing model**. Traditional construction estimation relies on gross historical unit rates (e.g., £2,200 per square meter of gross internal area), which conceals trade-level variances, site topography constraints, and market supply disruptions.

To solve this, the engine enforces strict decoupling:
1. **Physical Quantity Layer**: Captures actual geometric takeoff with dedicated material waste factors.
2. **Resource Pricing Matrix**: Decomposes every standard construction task into its four fundamental commercial components (Labour, Material, Subcontract, Plant), dynamically linked to named trade contractors.
3. **Dual-Margin Waterfall**: Distinguishes direct production costs from site-specific preliminaries to establish a **Prime Cost Baseline**. Commercial overheads, profit margins, and project contingencies are subsequently applied to this consolidated baseline, establishing an unbreachable breakeven floor.

To prevent client-side margin erosion during commercial tender negotiations, the customer-facing schedule employs **proportional absorption**. Rather than presenting preliminaries, contractor margin, and risk reserves as standalone discretionary sums, the engine mathematically allocates these burdens across billable physical items. The resulting client schedule aligns to the exact penny of the internal commercial appraisal while keeping sensitive trade margins fully protected.

---

## Other Tools in This Series

- **[Subcontractor Quote Comparison & Variance Engine](#)**: Cross-examines multiple trade tender returns against baseline internal estimates to identify pricing anomalies and scope gaps.
- **[Construction Cash Flow & Milestone S-Curve Planner](#)**: Converts bill of quantities schedules into monthly valuation forecasts, retention tracking, and working capital drawdowns.
- **[Residential Project Job Costing & Actuals Tracker](#)**: Post-award cost control system tracking purchase orders, labor timesheets, and variation orders against original tender baselines.

---

## License

This project is licensed under the **Apache License 2.0**. See the [LICENSE](LICENSE) file for details.
