import { useState } from "react";

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
  // Initialise controlled state from schema so the form is
  // fully generic — adding a JSON field is the only change needed.
  const initial = schema.reduce(
    (acc, field) => ({ ...acc, [field.name]: "" }),
    {}
  );

  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});

  // --- Validation ---
  // Runs over the full schema so validation rules stay co-located
  // with field definitions in the JSON, not scattered across components.
  const validate = () => {
    const next = {};
    schema.forEach((field) => {
      const raw = values[field.name]?.toString().trim() ?? "";
      if (field.required && !raw) {
        next[field.name] = `${field.label} is required.`;
      } else if (field.type === "number" && raw !== "") {
        const num = parseFloat(raw);
        if (isNaN(num) || num <= 0) {
          next[field.name] = `${field.label} must be a positive number.`;
        }
      }
    });
    return next;
  };

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear error as soon as the user starts correcting the field.
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    // Coerce numeric fields so callers always get the right type.
    const parsed = {};
    schema.forEach((field) => {
      const raw = values[field.name]?.toString().trim() ?? "";
      parsed[field.name] = field.type === "number" ? parseFloat(raw) : raw;
    });
    onSubmit(parsed);
    setValues(initial);
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="form-body">
      {schema.map((field) => (
        <div key={field.name} className="field-group">
          <label htmlFor={`field-${field.name}`}>
            {field.label}
            {field.required && <span className="required-star"> *</span>}
          </label>

          {field.type === "textarea" ? (
            <textarea
              id={`field-${field.name}`}
              placeholder={field.placeholder}
              value={values[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className={errors[field.name] ? "error-field" : ""}
              rows={3}
            />
          ) : (
            <input
              id={`field-${field.name}`}
              type={field.type === "number" ? "text" : field.type}
              inputMode={field.type === "number" ? "decimal" : undefined}
              placeholder={field.placeholder}
              value={values[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className={errors[field.name] ? "error-field" : ""}
            />
          )}

          {errors[field.name] && (
            <span className="field-error">{errors[field.name]}</span>
          )}
        </div>
      ))}

      <button type="submit" className="btn-submit">
        Add Product
      </button>
    </form>
  );
}
