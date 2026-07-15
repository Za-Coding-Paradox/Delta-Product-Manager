import { useReducer, useEffect } from 'react';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const computeInitial = (schema) =>
  schema.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {});

// ─── Local Form Reducer ───────────────────────────────────────────────────────
// values and errors are always updated together, so they belong in one reducer.
function formReducer(state, action) {
  switch (action.type) {
    case 'CHANGE_FIELD':
      return {
        values: { ...state.values, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: '' }, // clear error as user types
      };
    case 'SET_ERRORS':
      return { ...state, errors: action.errors };
    case 'RESET':
      return { values: action.initial, errors: {} };
    default:
      return state;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
/**
 * Form
 * A fully schema-driven form. It knows nothing about "products" —
 * it only knows how to render a list of field definitions and
 * call onSubmit with a { fieldName: value } map.
 *
 * Props:
 *   schema   — array of field defs from data.json → formSchema
 *   onSubmit — callback(parsedValues) called after successful validation
 */
export default function Form({ schema, onSubmit }) {
  const [{ values, errors }, dispatch] = useReducer(formReducer, {
    values: computeInitial(schema),
    errors: {},
  });

  // Re-initialise if schema ever changes (e.g. a different form config is passed in).
  // This makes the generic Form component safe for reuse across different schemas.
  useEffect(() => {
    dispatch({ type: 'RESET', initial: computeInitial(schema) });
  }, [schema]);

  const validate = () => {
    const next = {};
    schema.forEach(field => {
      const raw = values[field.name]?.toString().trim() ?? '';
      if (field.required && !raw) {
        next[field.name] = `${field.label} is required.`;
      } else if (field.type === 'number' && raw !== '') {
        const num = parseFloat(raw);
        if (isNaN(num) || num <= 0)
          next[field.name] = `${field.label} must be a positive number.`;
      }
    });
    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length > 0) {
      dispatch({ type: 'SET_ERRORS', errors: fieldErrors });
      return;
    }
    const parsed = {};
    schema.forEach(field => {
      const raw = values[field.name]?.toString().trim() ?? '';
      parsed[field.name] = field.type === 'number' ? parseFloat(raw) : raw;
    });
    onSubmit(parsed);
    dispatch({ type: 'RESET', initial: computeInitial(schema) });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="form-body">
      {schema.map(field => (
        <div key={field.name} className="field-group">
          <label htmlFor={`field-${field.name}`}>
            {field.label}
            {field.required && <span className="required-star"> *</span>}
          </label>

          {field.type === 'textarea' ? (
            <textarea
              id={`field-${field.name}`}
              placeholder={field.placeholder}
              value={values[field.name]}
              onChange={e => dispatch({ type: 'CHANGE_FIELD', field: field.name, value: e.target.value })}
              className={errors[field.name] ? 'error-field' : ''}
              rows={3}
            />
          ) : (
            <input
              id={`field-${field.name}`}
              type={field.type === 'number' ? 'text' : field.type}
              inputMode={field.type === 'number' ? 'decimal' : undefined}
              placeholder={field.placeholder}
              value={values[field.name]}
              onChange={e => dispatch({ type: 'CHANGE_FIELD', field: field.name, value: e.target.value })}
              className={errors[field.name] ? 'error-field' : ''}
            />
          )}

          {errors[field.name] && (
            <span className="field-error">{errors[field.name]}</span>
          )}
        </div>
      ))}

      <button type="submit" className="btn-submit">Add Product</button>
    </form>
  );
}
