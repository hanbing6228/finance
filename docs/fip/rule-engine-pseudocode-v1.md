# FIP Rule Engine Pseudocode v1

Status: draft
Scope: independent FIP finance module, Baohe-toolbox compatible later

## Design Principle

The rule engine must not hard-code bank names, card products, merchants, or
financial treatments in executable logic. The engine only loads versioned rule
modules, validates them, evaluates match conditions, applies configured
actions, and records explainable evidence.

Bank/card-specific behavior belongs in rule modules such as:

- `core-transfers.rules.yaml`
- `core-refunds.rules.yaml`
- `core-income.rules.yaml`
- `institutions/chase.rules.yaml`
- `institutions/amex.rules.yaml`
- `institutions/fidelity.rules.yaml`
- `user-overrides.rules.yaml`

## Rule Module Shape

```yaml
module_id: institutions/chase
version: 1
priority_base: 5000
enabled: true
applies_to:
  account_institutions: ["Chase"]
  account_types: ["credit", "depository"]
rules:
  - rule_id: chase-credit-card-payment-v1
    priority: 100
    match:
      all:
        - field: description
          operator: regex
          value: "(AUTOPAY PAYMENT|EPAYMENT|THANK YOU)"
        - field: account_type
          operator: equals
          value: "credit"
    actions:
      category: Internal Transfer
      subcategory: Credit Card Payment
      treatment: credit_card_payment
      cashflow_layer: internal_flow
      confidence: 0.98
```

Effective priority is `priority_base + rule.priority`. User overrides should
have the highest `priority_base`.

## Pseudocode

```text
function classify_batch(raw_transactions, account_index, rule_module_paths, run_context):
    rule_modules = load_rule_modules(rule_module_paths)
    active_modules = filter_enabled_modules(rule_modules, run_context)
    validate_modules(active_modules)

    rules = []
    for module in active_modules:
        for rule in module.rules:
            normalized_rule = compile_rule(module, rule)
            rules.append(normalized_rule)

    rules.sort(by effective_priority descending, then module_id, then rule_id)

    classified_rows = []
    review_rows = []
    evidence_rows = []

    for tx in raw_transactions:
        account = account_index[tx.account_id]
        tx_context = build_transaction_context(tx, account, run_context)

        match_result = evaluate_first_match(tx_context, rules)

        if match_result.exists:
            classified = apply_actions(tx, account, match_result.rule.actions)
            classified.rule_id = match_result.rule.rule_id
            classified.rule_module_id = match_result.rule.module_id
            classified.confidence = match_result.rule.actions.confidence
            classified.review_status = review_status_for(classified.confidence)

            evidence_rows.append(build_rule_evidence(tx, match_result))
        else:
            classified = build_needs_review_row(tx, account)
            review_rows.append(build_review_queue_row(tx, account))

        classified_rows.append(classified)

    return {
        classified_transactions: classified_rows,
        review_queue: review_rows,
        classification_evidence: evidence_rows,
        run_summary: summarize_classification_run(classified_rows, review_rows)
    }

function load_rule_modules(paths):
    modules = []
    for path in paths:
        document = parse_yaml_or_json(path)
        modules.append(document)
    return modules

function validate_modules(modules):
    for module in modules:
        require(module.module_id)
        require(module.version)
        require_unique_rule_ids(module.rules)
        reject_unknown_operators(module.rules)
        reject_unknown_treatments(module.rules)
        reject_unknown_cashflow_layers(module.rules)
        require_actions_for_each_rule(module.rules)
        require_no_executable_code(module.rules)

function compile_rule(module, rule):
    return {
        module_id: module.module_id,
        version: module.version,
        rule_id: rule.rule_id,
        effective_priority: module.priority_base + rule.priority,
        matcher: compile_match_tree(rule.match),
        actions: rule.actions,
        explanation_template: rule.explanation_template
    }

function evaluate_first_match(tx_context, rules):
    for rule in rules:
        result = evaluate_match_tree(tx_context, rule.matcher)
        if result.matched:
            return { exists: true, rule: rule, evidence: result.evidence }
    return { exists: false }

function evaluate_match_tree(tx_context, matcher):
    if matcher.type == "all":
        return all child matchers pass
    if matcher.type == "any":
        return at least one child matcher passes
    if matcher.type == "not":
        return child matcher does not pass

    value = read_field(tx_context, matcher.field)
    return evaluate_operator(value, matcher.operator, matcher.value)

function apply_actions(tx, account, actions):
    normalized_amount = normalize_amount(tx.amount, account.account_type, actions.treatment)

    return {
        transaction_id: tx.transaction_id,
        account_id: tx.account_id,
        date: tx.date,
        description: tx.description,
        merchant_name: tx.merchant_name,
        amount: tx.amount,
        normalized_amount: normalized_amount,
        category: actions.category,
        subcategory: actions.subcategory,
        treatment: actions.treatment,
        cashflow_layer: actions.cashflow_layer,
        is_spending: actions.treatment == "spending",
        is_income: actions.cashflow_layer == "income",
        is_internal_flow: actions.cashflow_layer == "internal_flow",
        is_refund: actions.treatment == "refund_offset",
        is_excluded: actions.treatment == "exclude"
    }
```

## Supported Match Operators v1

- `equals`
- `not_equals`
- `in`
- `contains`
- `regex`
- `amount_between`
- `date_between`
- `is_missing`
- `is_present`

## Supported Actions v1

Required:

- `category`
- `subcategory`
- `treatment`
- `cashflow_layer`
- `confidence`

Optional:

- `review_status`
- `tags`
- `notes`
- `derived_fields`

## Review Status Policy

```text
if confidence >= 0.95:
    review_status = "auto_classified"
elif confidence >= 0.75:
    review_status = "suggested_review"
else:
    review_status = "needs_review"
```

User-edited classifications should generate either:

- a transaction-level override, or
- a new rule proposal in `user-overrides.rules.yaml`

The engine should never silently mutate system rule modules.

## Baohe Integration Boundary

For future Baohe toolbox integration, FIP should expose a static module
contract first:

- module id: `finance`
- route key: `finance`
- data package inputs: CSV/JSON/YAML files only in v1
- real bank authorization: disabled until explicit approval
- payment or transfer execution: not supported
- tax, investment, and legal advice: not supported

